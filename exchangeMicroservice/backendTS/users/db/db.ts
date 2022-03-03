const knex=require("knex")
import knexfile from "./knexfile";

const db=knex(knexfile.development)
export default db;