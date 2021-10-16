const express = require('express');
const router = express.Router();
const { getDescription, postDescription } = require('./controllers')

router
  .get('/', getDescription)
  .post('/', postDescription)

module.exports = router;
