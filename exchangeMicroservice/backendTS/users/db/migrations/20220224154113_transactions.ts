import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", (table: Knex.TableBuilder) => {
    table.increments("id");
    table.integer("user_id");
    table.foreign("user_id").references("id").inTable("users");
    table.string("typeOperations").notNullable();
    table.integer("value").notNullable();
    table.string("currency").notNullable();
    table.date("date");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
