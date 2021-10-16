const express = require('express');
const router = express.Router();
const { getTitle, postTitle } = require('./controllers')

router
  .get('/', getTitle)
  .post('/', postTitle)

module.exports = router;
