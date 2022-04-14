import knex, { Knex } from "knex"
import knexConfig from "./knexConfig"
import createTables from "./scripts/createTables"
import dropTables from "./scripts/dropTables"
import seedTables from "./scripts/seeder"

const db: Knex = knex(knexConfig);

(async () => {
   switch (process.argv[2]) {
      case ("create"): {
         return createTables(db)
      }
      case ("destroy"): {
         return dropTables(db)
      }
      case ("seed"): {
         return seedTables(db)
      }
      case ("reseed"): {
         return dropTables(db)
         .then(() => createTables(db))
         .then(() => seedTables(db))
      }
   }
})()
.then(() => db.destroy())
