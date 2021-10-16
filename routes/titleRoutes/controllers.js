require('colors')
const fsProm = require('fs/promises');
const path = require('path');

const titlePath = path.join(__dirname, '../../db/title.json')

const getTitle = async (req, res, next) => {
    try {
        const data = await fsProm.readFile(titlePath, "utf-8");
        const parsedData = JSON.parse(data);
        res.status(200).send(parsedData);
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err);
    }
}

const postTitle = async (req, res, next) => {
    try {
        const newData = req.body;
        await fsProm.writeFile(
            titlePath,
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

module.exports = { getTitle, postTitle }