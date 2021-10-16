const path = require('path');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const photoRouter = require('./routes/photoRoutes')
const titleRouter = require('./routes/titleRoutes')
const descriptionRouter = require('./routes/descriptionRoutes')

const app = express();
const PORT = process.env.PORT || 3003;

const loggerMode = process.env.NODE_ENV === 'development' ? 'dev' : 'short';
app.use(logger(loggerMode));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

app.use('/api/photo', photoRouter);
app.use('/api/title', titleRouter);
app.use('/api/description', descriptionRouter);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log("starting listening on port", PORT);
    })
  } catch (e) {
    console.log(e)
  }
}

start()