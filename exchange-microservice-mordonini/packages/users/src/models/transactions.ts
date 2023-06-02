import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { bank_accounts, bank_accountsId } from './bank_accounts';

export interface transactionsAttributes {
  id: number;
  given_currency: number;
  obtained_currency: number;
  given_currency_type: string;
  obtained_currency_type: string;
  creation_date?: Date;
  transaction_type: string;
  bank_account_id: number;
}

export type transactionsPk = "id";
export type transactionsId = transactions[transactionsPk];
export type transactionsOptionalAttributes = "id" | "given_currency" | "obtained_currency" | "creation_date";
export type transactionsCreationAttributes = Optional<transactionsAttributes, transactionsOptionalAttributes>;

export class transactions extends Model<transactionsAttributes, transactionsCreationAttributes> implements transactionsAttributes {
  id!: number;
  given_currency!: number;
  obtained_currency!: number;
  given_currency_type!: string;
  obtained_currency_type!: string;
  creation_date!: Date;
  transaction_type!: string;
  bank_account_id!: number;

  // transactions belongsTo bank_accounts via bank_account_id
  bank_account!: bank_accounts;
  getBank_account!: Sequelize.BelongsToGetAssociationMixin<bank_accounts>;
  setBank_account!: Sequelize.BelongsToSetAssociationMixin<bank_accounts, bank_accountsId>;
  createBank_account!: Sequelize.BelongsToCreateAssociationMixin<bank_accounts>;

  static initModel(sequelize: Sequelize.Sequelize): typeof transactions {
    return transactions.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    given_currency: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.00
    },
    obtained_currency: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.00
    },
    given_currency_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    obtained_currency_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    transaction_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bank_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bank_accounts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'transactions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "transactions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}

