const multer = require("multer");
const shortid = require('shortid');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/images"),
    filename: (req, file, cb) => {
        const fileName = file.originalname
        const splitted = fileName.split('.')
        const extension = splitted.pop()
        const fileNameWithoutExtension = splitted.join()
        const uniqueName = `${fileNameWithoutExtension}-${shortid.generate()}.${extension}`
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, ["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype));
}

const multerMiddleware = multer({ storage: storageConfig, fileFilter: fileFilter }).single("photo")

module.exports = multerMiddleware;