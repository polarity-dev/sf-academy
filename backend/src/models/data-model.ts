import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Data extends Model<InferAttributes<Data>, InferCreationAttributes<Data>> {
    declare id: CreationOptional<number>;
    declare value: number;
    declare message: string;
    declare processed_at: Date

    static start(sequelize: Sequelize) {
        Data.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            processed_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'data',
            sequelize,
            underscored: true
        })
    }
};
