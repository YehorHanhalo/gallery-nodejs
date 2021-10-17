const path = require('path');
const fs = require('fs');
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

const ImagesFolderPath = path.join(__dirname, '../../public/images')

if (!fs.existsSync(ImagesFolderPath)) {
    fs.mkdirSync(ImagesFolderPath)
}

const getAllPhotos = async (req, res, next) => {
    try {
        const { page, limit } = req.query
        const photoNames = await fsProm.readdir(ImagesFolderPath)

        const paginate = paginateList({ list: photoNames, page, limit })
        paginate.photos = paginate.photos.map(name => `images/${name}`)
        res.status(200).send(paginate);
    } catch (err) {
        res.status(400).send(err);
        return console.error(err.message);
    }
}

const postPhoto = async (req, res, next) => {
    try {
        const fileData = req.file;

        if(!fileData) {
            res.status(406).send('Wrong MIME-type');
            return
        }

        const photoPath = fileData.path.split('public/')[1]

        res.status(201).send({ path: photoPath });
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