import { Knex } from "knex";
import { dbHost, dbPort, dbUser, dbPassword, dbName } from "./config";

const knexConfig: Knex.Config = {
	client: "postgres",
	connection: {
		host: dbHost,
		port: parseInt(dbPort as string),
		user: dbUser,
		password: dbPassword,
		database: dbName,
	},
};

export default knexConfig;
