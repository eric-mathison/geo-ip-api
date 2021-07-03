const cron = require('node-cron');
const { update } = require('./downloader');
const logger = require('../config/logger');

cron.schedule('0 4 * * 3', () => {
    logger.debug('Running Cron Updater Schedule');
    update();
});
