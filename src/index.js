const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const logger = require('./config/logger');
const { download } = require('./services/downloader');

const app = express();
const PORT = process.env.PORT || 5001;

app.set('trust proxy', true);

app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(
    morgan('common', {
        skip: (req, res) => res.statusCode < 400,
        stream: process.stderr,
    })
);

app.use(
    morgan('common', {
        skip: (req, res) => res.statusCode >= 400,
        stream: process.stdout,
    })
);

require('./routes')(app);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Server Error');
});

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    logger.error('400 page requested');
    res.status(404).send('Page not found');
});

require('./services/scheduler');

download().then(() => {
    app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
});

module.exports = app;
