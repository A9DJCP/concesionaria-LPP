const router = require("express").Router();
require("dotenv").config();
const usuarios = require("../dataccess/userEntry");
const functions = require("../dataccess/functions");
const { Usuario } = require("../models/relaciones.js");

router.post("/log", async (req, res) => {
	const { body } = req;
	const index = await usuarios.buscarUsuario(req.body["nickname"]);
	if (index >= 0) {
		let tokenData;
		const body2 = (await functions.getOne(index, Usuario)).dataValues;
		if (body2.permisoCodPermiso == 1) {
			tokenData = {
				nickname: body.nickname,
				id: body2.codUsuario,
				permisoCodPermiso: 1,
			};
		} else {
			tokenData = {
				nickname: body.nickname,
				id: body2.codUsuario,
				permisoCodPermiso: 2,
			};
		}
		const token = jwt.sign(tokenData, process.env.JWTSECRET, {
			expiresIn: "15m",
		});
		res.status(200).send({
			token,
			nickname: body.nickname,
			permisos: tokenData.permisoCodPermiso,
		});
	} else {
		return res.status(401).json({ error: "credenciales incorrectas" });
	}
});

module.exports = router;
