const express = require('express');
const router = express.Router();
const { multerMiddleware } = require('../../middlewares')
const { getAllPhotos, postPhoto, deleteAllPhotos } = require('./controllers')

router
  .get('/', getAllPhotos)
  .post('/', multerMiddleware, postPhoto)
  .delete('/', deleteAllPhotos)

module.exports = router;
