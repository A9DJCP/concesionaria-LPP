const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

export class OrdenDeCompra extends Model {}
OrdenDeCompra.init(
	{
		codODC: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		codCL: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true, //Chequear si foreignKey:true no da error
		},
		codAD0KM: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true, //Chequear si foreignKey:true no da error
		},
		codFP: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true, //Chequear si foreignKey:true no da error
		},
		fechapedido: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		vigente: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "OrdenDeCompra",
	}
);
