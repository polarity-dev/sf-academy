import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { bank_accounts, bank_accountsId } from './bank_accounts';

export interface usersAttributes {
  id: number;
  email: string;
  name: string;
  surname: string;
  passwd: string;
  creation_date?: Date;
  fingerprint: string;
}

export type usersPk = "id";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "id" | "creation_date" | "fingerprint";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  id!: number;
  email!: string;
  name!: string;
  surname!: string;
  passwd!: string;
  creation_date?: Date;
  fingerprint!: string;

  // users hasMany bank_accounts via user_id
  bank_accounts!: bank_accounts[];
  getBank_accounts!: Sequelize.HasManyGetAssociationsMixin<bank_accounts>;
  setBank_accounts!: Sequelize.HasManySetAssociationsMixin<bank_accounts, bank_accountsId>;
  addBank_account!: Sequelize.HasManyAddAssociationMixin<bank_accounts, bank_accountsId>;
  addBank_accounts!: Sequelize.HasManyAddAssociationsMixin<bank_accounts, bank_accountsId>;
  createBank_account!: Sequelize.HasManyCreateAssociationMixin<bank_accounts>;
  removeBank_account!: Sequelize.HasManyRemoveAssociationMixin<bank_accounts, bank_accountsId>;
  removeBank_accounts!: Sequelize.HasManyRemoveAssociationsMixin<bank_accounts, bank_accountsId>;
  hasBank_account!: Sequelize.HasManyHasAssociationMixin<bank_accounts, bank_accountsId>;
  hasBank_accounts!: Sequelize.HasManyHasAssociationsMixin<bank_accounts, bank_accountsId>;
  countBank_accounts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "users_email_key"
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    passwd: {
      type: DataTypes.CHAR(64),
      allowNull: false
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    fingerprint: {
      type: DataTypes.CHAR(64),
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('DEFAULT')
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
