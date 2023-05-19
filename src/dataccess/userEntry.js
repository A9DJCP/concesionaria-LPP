//FORMATO user(id, nickname, name, sname, email, permisos)
const { Usuario } = require("../models/relaciones.js");
const { Permiso } = require("../models/relaciones.js");
const functions = require("../dataccess/functions");

const buscarUsuario = async (nickname) => {
	let options;
	options = {
		attributes: ["codUsuario"],
		where: {
			nickname: nickname,
		},
	};
	const index = (await Usuario.findOne(options)).codUsuario;
	if (index >= 0) {
		return index;
	} else {
		return -1;
	}
};
const getByFiltro = async (permisosFiltro) => {
	let options;
	if (permisosFiltro) {
		options = {
			attributes: ["codPermiso"],
			where: {
				descripcion: permisosFiltro,
			},
		};
	}
	const PermisoX = await Permiso.findOne(options);
	const codPermiso = PermisoX.codPermiso;

	if (codPermiso >= 0 && codPermiso <= 2) {
		options = {
			attributes: [
				"codUsuario",
				"nickname",
				"password",
				"nombre",
				"apellido",
				"email",
			],
			where: {
				permisoCodPermiso: codPermiso,
			},
		};
	}
	const datos = await Usuario.findAll(options);
	return datos;
};

const getAll = async (filter) => {
	let datos;
	let options = { include: [{ model: Usuario, required: false }] };
	//Filtro Completo
	if (
		filter.nickname != null &&
		filter.nombre != null &&
		filter.email != null &&
		filter.apellido != null
	) {
		options = {
			where: {
				nickname: filter.nickname.toLowerCase(),
				nombre: filter.nombre.toLowerCase(),
				apellido: filter.apellido.toLowerCase(),
				email: filter.email.toLowerCase(),
			},
		};
		datos = await Usuario.findAll(options);
	} else {
		if (
			filter.nickname == null &&
			filter.nombre == null &&
			filter.apellido == null &&
			filter.email == null
		) {
			datos = await Usuario.findAll();
		} else {
			//Filtros Individuales - Pendiente
			//Filtrar por nickname
			if (filter.nickname != null) {
				options = {
					...options,
					where: {
						...options.where,
						nickname: filter.nickname.toLowerCase(),
					},
				};
			}

			//Filtrar por nombre
			if (filter.nombre != null) {
				options = {
					...options,
					where: {
						...options.where,
						nombre: filter.nombre.toLowerCase(),
					},
				};
			}

			//Filtrar por apellido
			if (filter.apellido != null) {
				options = {
					...options,
					where: {
						...options.where,
						apellido: filter.apellido.toLowerCase(),
					},
				};
			}
			//Filtrar por email
			if (filter.email != null) {
				options = {
					...options,
					where: {
						...options.where,
						email: filter.email.toLowerCase(),
					},
				};
			}
			/* PENDIENTE. HAY QUE VER LA RELACION CON LA TABLA PERMISOS
			//Filtrar por Permisos
			if (filter.permisoCodPermiso != null) {
			options = {
			...options,
			where: {
				...options.where,
				permisoCodPermiso: filter.permisoCodPermiso,
				},
			};
		}
		*/
			datos = await Usuario.findAll(options);
		}
	}
	return datos;
};

const update = async (id, body, entry) => {
	const data = await functions.getOne(id, Usuario);
	data.nickname = body.nickname;
	data.password = body.password;
	data.nombre = body.nombre;
	data.apellido = body.apellido;
	data.email = body.email;
	data.permisoCodPermiso = body.permisoCodPermiso;
	await data.save();
	return data;
};

module.exports = {
	getByFiltro,
	buscarUsuario,
	getAll,
	update,
};
