import { bank_accounts as _bank_accounts } from "./bank_accounts";
import type { bank_accountsAttributes, bank_accountsCreationAttributes } from "./bank_accounts";
import { transactions as _transactions } from "./transactions";
import type { transactionsAttributes, transactionsCreationAttributes } from "./transactions";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";
import { wallets as _wallets } from "./wallets";
import type { walletsAttributes, walletsCreationAttributes } from "./wallets";
import { Sequelize } from "sequelize";

// Hooks
import { checkBeforeWithdraw } from "../db/hooks/transaction_hooks";
import { hashUserPassword } from "../db/hooks/user_hooks";

export {
  _bank_accounts as bank_accounts,
  _transactions as transactions,
  _users as users,
  _wallets as wallets
};

export type {
  bank_accountsAttributes,
  bank_accountsCreationAttributes,
  transactionsAttributes,
  transactionsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
  walletsAttributes,
  walletsCreationAttributes
};

export function initModels(sequelize: Sequelize) {
  const bank_accounts = _bank_accounts.initModel(sequelize);
  const transactions = _transactions.initModel(sequelize);
  const users = _users.initModel(sequelize);
  const wallets = _wallets.initModel(sequelize);

  // Relations
  transactions.belongsTo(bank_accounts, { as: "bank_account", foreignKey: "bank_account_id"});
  wallets.belongsTo(bank_accounts, { as: "bank_account", foreignKey: "bank_account_id"})
  bank_accounts.hasMany(transactions, { as: "transactions", foreignKey: "bank_account_id"});
  bank_accounts.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(bank_accounts, { as: "bank_accounts", foreignKey: "user_id"});

  // Hooks(triggers)
  transactions.beforeCreate('beforeCreateCheckCurrencyAmount', checkBeforeWithdraw)
  transactions.beforeUpdate('beforeUpdateCheckCurrencyAmount', checkBeforeWithdraw)
  users.beforeCreate('beforeCreateHashPassword', hashUserPassword)
  users.beforeUpdate('beforeUpdateHashPassword', hashUserPassword)
  
  return {
    bank_accounts: bank_accounts,
    transactions: transactions,
    users: users,
    wallets: wallets
  };
}
