const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

export class Propietario extends Model {}
Propietario.init(
	{
		codP: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		codPer: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true, //Chequear si foreignKey:true no da error
		},
		borrado: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Propietario",
	}
);
