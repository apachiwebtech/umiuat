const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create logger instance
const logger = createLogger({
    level: 'info',  // Log only 'info' level and above
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console(),  // Log to console
        new transports.File({ filename: 'app.log' })  // Log to a file
    ]
});

module.exports = logger;
