import { Sequelize } from "sequelize";
import logger from "jet-logger";

function log(sql: string, timing?: number): void {
    logger.info(sql);
}

function loggingEnabled(): boolean {
    return (!!process.env.DB_LOG && process.env.DB_LOG.toUpperCase() === 'TRUE');
}

const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,

    logging: loggingEnabled() ? log : false
});

export default sequelize;