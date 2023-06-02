import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { bank_accounts } from './bank_accounts';

export interface walletsAttributes {
  id: number;
  bank_account_id: number;
  currency_type: string;
  currency_amount: number;
}

export type walletsPk = "id";
export type walletsId = bank_accounts[walletsPk];
export type walletsOptionalAttributes = "currency_amount";
export type walletsCreationAttributes = Optional<walletsAttributes, walletsOptionalAttributes>;

export class wallets extends Model<walletsAttributes, walletsCreationAttributes> implements walletsAttributes {
  id!: number;
  bank_account_id!: number;
  currency_type!: string;
  currency_amount!: number;

  // wallets belongsTo bank_accounts via iban
  bank_account!: bank_accounts;
  getBank_account!: Sequelize.BelongsToGetAssociationMixin<bank_accounts>;
  //setBank_account!: Sequelize.BelongsToSetAssociationMixin<bank_accounts, bank_accountsId>;
  //createBank_account!: Sequelize.BelongsToCreateAssociationMixin<bank_accounts>;

  static initModel(sequelize: Sequelize.Sequelize): typeof wallets {
    return wallets.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bank_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bank_accounts',
        key: 'id'
      }
    },
    currency_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'wallets',
    schema: 'public',
    timestamps: false
  });
  }
}
