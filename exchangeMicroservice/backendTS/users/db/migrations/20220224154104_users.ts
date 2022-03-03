import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("name").notNullable();
    table.string("iban").notNullable().unique();
    table.integer("balance").notNullable();
    table.integer("balance_eur").notNullable();
    table.integer("balance_usd").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
