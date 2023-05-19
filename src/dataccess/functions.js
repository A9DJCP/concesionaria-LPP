const { Usuario } = require("../models/relaciones.js"); //Busca el objeto Usuario de la clase relaciones.js
const { Producto } = require("../models/relaciones.js"); //Busca el objeto Usuario de la clase relaciones.js
const { Categoria } = require("../models/relaciones.js"); //Busca el objeto Usuario de la clase relaciones.js
const { SubCategoria } = require("../models/relaciones.js"); //Busca el objeto Usuario de la clase relaciones.js
const { Marca } = require("../models/relaciones.js"); //Busca el objeto Usuario de la clase relaciones.js

const getOne = async (id, modelo) => {
	return await modelo.findByPk(id);
};
const save = async (body, modelo) => {
	const data = { ...body };
	const model = await modelo.create(data);
	return model;
};

const borrar = async (id, modelo) => {
	if (modelo.name.toLowerCase() == "marca") {
		await modelo.destroy({
			where: {
				codMarca: id,
			},
		});
	} else if (modelo.name.toLowerCase() == "producto") {
		await modelo.destroy({
			where: {
				codProd: id,
			},
		});
	} else if (modelo.name.toLowerCase() == "categoria") {
		await modelo.destroy({
			where: {
				codCat: id,
			},
		});
	} else if (modelo.name.toLowerCase() == "subcategoria") {
		await modelo.destroy({
			where: {
				codSCat: id,
			},
		});
	} else if (modelo.name.toLowerCase() == "usuario") {
		await modelo.destroy({
			where: {
				codUsuario: id,
			},
		});
	}
};

module.exports = {
	getOne,
	save,
	borrar,
};
