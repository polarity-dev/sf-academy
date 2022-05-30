import { 
    CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model 
} from "sequelize";
import sequelize from "../db";

export class DataQueue extends Model<InferAttributes<DataQueue>, InferCreationAttributes<DataQueue>> {
    declare id: CreationOptional<number>;
    declare priority: number;
    declare message: string;
}

DataQueue.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        priority: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'data_queue',
        sequelize,
        underscored: true
    }
)
