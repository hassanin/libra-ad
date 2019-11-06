global.staticOptions = require('../config/static.json');
const logger = require('../api/logger');

process.on('exit', function (){
  executeShutdown();
});

process.on('SIGINT', function (){
  executeShutdown();
});

function executeShutdown()
{
  logger.info(`Shutting Down application!`);
  //global.mongoDbServer.destroy(); 
  process.exit();
}

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    logger.error('Uncaught Exception...');
    logger.error(e.stack);
    process.exit(1);
  });

  //add code tp close all database connections here