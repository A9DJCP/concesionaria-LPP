const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

export class AutoDisponible0km extends Model {}
AutoDisponible0km.init(
	{
		codAD0KM: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		marca: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		modelo: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		precio: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		color: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		borrado: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "AutoDisponible0km",
	}
);
