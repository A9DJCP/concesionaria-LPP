const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

export class Persona extends Model {}

Persona.init(
	{
		codPer: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		tipodoc: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		nrodoc: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		nom: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		ape: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		direc: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		tel: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		mail: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		borrado: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Persona",
	}
);
