const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

export class Cliente extends Model {}
Cliente.init(
	{
		codCL: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		codPer: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true, //Chequear si foreignKey:true no da error
		},
		requisitos: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		borrado: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Cliente",
	}
);
