const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

export class FormaPago extends Model {}
FormaPago.init(
	{
		codFP: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		descripcion: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "FormaPago",
	}
);
