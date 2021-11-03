const path = require('path');
const fs = require('fs');
const { PUBLIC, IMAGES } = require('../../utils/const')
const fsProm = fs.promises

const paginateList = ({ list, page, limit }) => {
    const pageNum = +page || 0
    const limitNum = +limit
    const maxLimit = 20
    const currentLimit = (!limitNum || limitNum > maxLimit) ? maxLimit : limitNum

    const maxPage = Math.ceil(list.length / currentLimit)
    const currentPage = pageNum > maxPage ? maxPage - 1 : pageNum

    const sliceBegin = currentPage * currentLimit
    const sliceEnd = (currentPage + 1) * currentLimit

    return {
        photos: list.slice(sliceBegin, sliceEnd),
        pages: maxPage,
    }
}

const PublicFolderPath = path.join(__dirname, `../../${PUBLIC}`)

if (!fs.existsSync(PublicFolderPath)) {
    fs.mkdirSync(PublicFolderPath)
}

const ImagesFolderPath = path.join(__dirname, `../../${PUBLIC}/${IMAGES}`)

if (!fs.existsSync(ImagesFolderPath)) {
    fs.mkdirSync(ImagesFolderPath)
}

const getAllPhotos = async (req, res, next) => {
    try {
        const { page, limit } = req.query
        const photoNames = await fsProm.readdir(ImagesFolderPath)

        const paginate = paginateList({ list: photoNames, page, limit })
        paginate.photos = paginate.photos.map(name => `${IMAGES}/${name}`)
        res.status(200).send(paginate);
    } catch (err) {
        res.status(400).send(err);
        return console.error(err.message);
    }
}

const postPhoto = async (req, res, next) => {
    try {
        const fileList = req.files;

        if(!fileList.length) {
            res.status(406).send('Wrong MIME-type');
            return
        }

        const photoPathList = fileList.map(file => file.path.split(`${PUBLIC}/`)[1])

        res.status(201).send({ path: photoPathList });
    } catch (err) {
        res.status(400).send('error');
        return console.error(err.message);
    }
}

const deleteAllPhotos = async (req, res, next) => {
    try {
        const photoNames = await fsProm.readdir(ImagesFolderPath)

        const unlinkPromises = []
        for (const photoName of photoNames) {
            const photoPath = path.join(ImagesFolderPath, photoName)
            unlinkPromises.push(fsProm.unlink(photoPath))
        }

        await Promise.all(unlinkPromises)
        res.status(200).send({deleted: true});
    } catch (err) {
        res.status(400).send(err);
        return console.error(err.message);
    }
}

module.exports = { getAllPhotos, postPhoto, deleteAllPhotos }