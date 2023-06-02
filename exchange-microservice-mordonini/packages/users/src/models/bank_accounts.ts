import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { transactions, transactionsId } from './transactions';
import type { users, usersId } from './users';
import type { wallets } from './wallets';

export interface bank_accountsAttributes {
  id: number;
  iban: string;
  creation_date: Date;
  user_id: number;
}

export type bank_accountsPk = "id";
export type bank_accountsId = bank_accounts[bank_accountsPk];
export type bank_accountsOptionalAttributes = "id" | "creation_date";
export type bank_accountsCreationAttributes = Optional<bank_accountsAttributes, bank_accountsOptionalAttributes>;

export class bank_accounts extends Model<bank_accountsAttributes, bank_accountsCreationAttributes> implements bank_accountsAttributes {
  id!: number;
  iban!: string;
  creation_date!: Date;
  user_id!: number;

  // bank_accounts hasMany transactions via bank_account_id
  transactions!: transactions[];
  getTransactions!: Sequelize.HasManyGetAssociationsMixin<transactions>;
  setTransactions!: Sequelize.HasManySetAssociationsMixin<transactions, transactionsId>;
  addTransaction!: Sequelize.HasManyAddAssociationMixin<transactions, transactionsId>;
  addTransactions!: Sequelize.HasManyAddAssociationsMixin<transactions, transactionsId>;
  createTransaction!: Sequelize.HasManyCreateAssociationMixin<transactions>;
  removeTransaction!: Sequelize.HasManyRemoveAssociationMixin<transactions, transactionsId>;
  removeTransactions!: Sequelize.HasManyRemoveAssociationsMixin<transactions, transactionsId>;
  hasTransaction!: Sequelize.HasManyHasAssociationMixin<transactions, transactionsId>;
  hasTransactions!: Sequelize.HasManyHasAssociationsMixin<transactions, transactionsId>;
  countTransactions!: Sequelize.HasManyCountAssociationsMixin;
  // bank_accounts hasMany wallets via bank_account_id
  getwalletss!: Sequelize.HasManyGetAssociationsMixin<wallets>;
  countwalletss!: Sequelize.HasManyCountAssociationsMixin;
  // bank_accounts belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof bank_accounts {
    return bank_accounts.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iban: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "bank_accounts_iban_key"
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'bank_accounts',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "bank_accounts_iban_key",
        unique: true,
        fields: [
          { name: "iban" },
        ]
      },
      {
        name: "bank_accounts_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
