import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import server from './server';
import sequelize from './db';
import * as schedule from './schedule';

// Constants
const serverStartMsg = 'Express server started on port: ',
        port = (process.env.PORT || 3000);

// Sync models to database
sequelize.sync();

// Start server
server.listen(port, () => {
    logger.info(serverStartMsg + port);
});

// Scheduled jobs
schedule.init()

