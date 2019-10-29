const winston = require('winston');
const {transports, createLogger, format} = require('winston');
const logDirectory = global.staticOptions.logDirectory || `./logs`;
const logLevel = global.staticOptions.logLevel || `debug`;
const enableConsoleLog = global.staticOptions.enableConsoleLog || true;

const logOptions = {
    file: {
      level: 'info',
      filename: './serviceLogs/serverController.log',
      maxsize: 52428800, // 50MB
      maxFiles: 5
    }
  };

if(!global.logger)
{
    const myFormat = format.combine(
        format.timestamp(),
        format.json()
    );
const logger = winston.createLogger({
  level: 'debug',
  format: myFormat,
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename:`${logDirectory}/ error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logDirectory}/combined.log` })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
// if (process.env.NODE_ENV !== 'production') {
if (enableConsoleLog== true) {
  logger.add(new winston.transports.Console({
    format: myFormat
  }));
}
global.logger=logger;
}
module.exports=global.logger;