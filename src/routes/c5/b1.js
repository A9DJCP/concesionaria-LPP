import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c5/b1", isLoggedIn, (req, res) => {
	res.render("./contratos/c5/verifProp");
});

router.post("/c5/b1/verifProp", isLoggedIn, async (req, res) => {
	var msg, data, rs, sql;
	try {
		var nom = req.body.nom;
		var ape = req.body.ape;
		var tdoc = req.body.tdoc;
		var ndoc = req.body.ndoc;
		var direc = req.body.direc;
		var tel = req.body.tel;
		var mail = req.body.mail;
		if (
			nom === "" ||
			ape === "" ||
			tdoc === "" ||
			ndoc === "" ||
			direc === "" ||
			tel === "" ||
			mail === ""
		) {
			msg =
				"Debe completar todos los datos para poder procesar la informacion.";
			res.render("./contratos/c5/b1", { msg });
		} else {
			sql = `select count(*) cont, codper FROM persona 
            WHERE nom='${nom}' AND ape='${ape}' AND tipodoc='${tdoc}' AND nrodoc='${ndoc}' AND borrado=0`;
			rs = await pool.query(sql);
			var cont = rs[0].cont;
			var codPer = rs[0].codper;
			if (cont === 0) {
				//El propietario no esta registrado como persona.
				// AND direc='${direc}' AND tel='${tel}' AND mail='${mail}'
				sql = `INSERT into Persona VALUES ('','${tdoc}', '${ndoc}','${nom}','${ape}','${direc}','${tel}','${mail}',0)`;
				await pool.query(sql);
				sql = `select MAX(codper) codper from persona`;
				rs = await pool.query(sql);
				codPer = rs[0].codper;
				sql = `INSERT into Propietario VALUES ('',${codPer},0)`;
				await pool.query(sql);
				msg = "Se ha registrado al nuevo propietario en el sistema.";
				sql = `select MAX(codP) codP from propietario where codper=${codPer}`;
				var codP = (await pool.query(sql))[0].codP;
				data = {
					codP,
					codPer,
				};
			} else {
				// El propietario esta registrado como persona
				sql = `select count(*) cont from propietario where borrado=0 and codper=${codPer}`;
				if ((await pool.query(sql))[0].cont === 0) {
					//El propietario esta registrado como persona pero no como propietario (era cliente).
					sql = `INSERT into Propietario values ('',${codPer},0)`;
					await pool.query(sql);
					msg = "Se ha registrado al nuevo propietario";
				} else {
					//El propietario esta registrado ya como propietario
					msg = "El propietario ha sido verificado.";
				}
				sql = `select MAX(codP) codP from propietario where codper=${codPer}`;
				rs = await pool.query(sql);
				var codP = rs[0].codP;
				data = {
					codP,
					codPer,
				};
			}
			res.render("./contratos/c5/regAutoUsado", { msg, data });
		}
	} catch (err) {
		console.log(err);
		res.render("/c5", { msg: err });
	}
});

router.post("/c5/b1/regAutoUsado", isLoggedIn, async (req, res) => {
	var msg, data, sql;
	try {
		var mat = req.body.mat;
		var marca = req.body.marca;
		var modelo = req.body.modelo;
		var precio = req.body.precio;
		var fecFab = req.body.fecFab;
		var codP = req.body.codP;
		var codPer = req.body.codPer;
		var uso = req.body.uso;
		var chasis = req.body.chasis;
		var motor = req.body.motor;
		var color = req.body.color;
		if (
			!mat ||
			!marca ||
			!modelo ||
			!precio ||
			!fecFab ||
			!codP ||
			!codPer ||
			!uso ||
			!chasis ||
			!motor ||
			!color
		) {
			msg =
				"Debe completar todas las casillas de datos para poder registrar el automovil";
			data = {
				codP,
				codPer,
			};
			res.render("./contratos/c5/regAutoUsado", { msg, data });
		} else {
			sql = `INSERT into autousado VALUES ('','${mat}','${marca}','${modelo}',${precio},
            '${fecFab}',${codP},'${uso}','${chasis}','${motor}',0,0,0,'${color}')`;
			await pool.query(sql);
			msg =
				"Se ha registrado el automóvil usado y está listo para que su documentación sea enviada a CONTRATACIONES para elaborar el correspondiente contrato.";
			res.render("./contratos/c5", { msg });
		}
	} catch (err) {
		console.log(err);
		res.render("./contratos/c5", { msg: err });
	}
});

export default router;