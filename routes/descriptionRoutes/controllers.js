require('colors')
const fsProm = require('fs/promises');
const path = require('path');

const descriptionPath = path.join(__dirname, '../../db/description.json')

const getDescription = async (req, res, next) => {
    try {
        const data = await fsProm.readFile(descriptionPath, "utf-8");
        const parsedData = JSON.parse(data);
        res.status(200).send(parsedData);
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err);
    }
}

const postDescription = async (req, res, next) => {
    try {
        const newData = req.body;
        await fsProm.writeFile(
            descriptionPath,
            JSON.stringify(newData, null, 2),
            "utf-8",
            (err) => {
                if (err) throw err;
            }
        )
        res.status(201).send(newData);
    } catch (err) {
        console.error(err.message);
        res.status(400).send('error');
    }
}

module.exports = { getDescription, postDescription }