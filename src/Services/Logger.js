import winston, { format, createLogger, transports } from 'winston';
const { combine, timestamp, printf, splat } = format;
const CATEGORY = "";
const myFormat = printf(({ timestamp, level, message, meta }) => {
    return `${timestamp}; ${level}; ${message}; ${meta? JSON.stringify(meta) : ''}`;
});
const Logger = createLogger({
    level: "info",
    format: combine(
        timestamp(),
        splat(),
        myFormat
    ),
    transports: [
        new (winston.transports.File)({
            name: 'application',
            filename: './logs/application-logs.log',
            level: 'info'
        })
    ]
});

export { Logger } ;