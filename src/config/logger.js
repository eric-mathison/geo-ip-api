const { createLogger, format, transports } = require('winston');
const keys = require('./keys');

const level = keys.logLevel;

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
    ),
    transports: [
        new transports.Console({
            level,
        }),
    ],
});

module.exports = logger;
