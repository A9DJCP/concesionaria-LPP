import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c5/b2", isLoggedIn, (req, res) => {
	res.render("./contratos/c5/verifAuto");
});

router.post("/c5/b2/verifDatos", isLoggedIn, async (req, res) => {
	var msg, data, rs, sql;
	try {
		var nom = req.body.nom;
		var ape = req.body.ape;
		var tdoc = req.body.tdoc;
		var ndoc = req.body.ndoc;
		var marca = req.body.marca;
		var mat = req.body.mat;
		var modelo = req.body.modelo;
		if (!nom || !ape || !tdoc || !ndoc || !marca || !mat || !modelo) {
			msg =
				"Debe completar todos los datos para poder procesar la informacion.";
			res.render("./contratos/c5/b2", { msg });
		} else {
			sql = `SELECT COUNT(*) cont, codAU FROM persona Per, propietario P, autousado A 
            WHERE Per.codper=P.codper AND A.codP=P.codP AND nom='${nom}' AND ape='${ape}' AND marca='${marca}'
            AND modelo='${modelo}' AND matricula='${mat}' and tipodoc='${tdoc}' and nrodoc='${ndoc}'`;
			rs = await pool.query(sql);
			var cont = rs[0].cont;
			var codAU = rs[0].codAU;
			if (cont === 0) {
				msg =
					"Los datos ingresados son inválidos o no corresponden a un automóvil usado registrado para ese propietario.";
				res.render("./contratos/c5/b2", { msg });
			} else {
				sql = `select COUNT(*) cont FROM contrato where codAU=${codAU} AND estado='Abierto'`;
				cont = (await pool.query(sql))[0].cont;
				if (cont === 1) {
					msg = "El automóvil ingresado ya tiene un contrato vigente.";
					res.render("./contratos/c5/b2", { msg });
				} else {
					msg =
						"Se ha verificado el automóvil usado ingresado. Proceda a registrar el contrato del mismo.";
					res.render("./contratos/c5/regContrato", { msg, codAU });
				}
			}
		}
	} catch (err) {
		console.log(err);
		res.render("/c5", { msg: err });
	}
});

router.post("/c5/b2/registrarContrato", isLoggedIn, async (req, res) => {
	var msg, sql;
	try {
		var codAU = req.body.codAU;
		var femision = req.body.femision;
		var fvto = req.body.fvto;
		var cond = req.body.cond;
		var porc = req.body.porc;
		if (!femision || !fvto || !cond || !porc) {
			msg =
				"Se deben llenar todas las casillas con información válida para registrar el contrato.";
			res.render("./contratos/c5/regContrato", { msg, codAU });
		} else {
			var today = new Date();
			const year = today.getFullYear(); // Obtener el año (ej. 2023)
			const month = today.getMonth() + 1; // Obtener el mes (0-11, por lo que sumamos 1)
			const day = today.getDate(); // Obtener el día del mes
			today = `${year}-${month.toString().padStart(2, "0")}-${day
				.toString()
				.padStart(2, "0")}`;
			if (femision >= fvto || femision > today || fvto < today) {
				msg =
					"La fecha de emisión no puede ser mayor a hoy, la fecha de vencimiento no puede ser menor o igual a hoy y la fecha de vencimiento no puede ser menor o igual a la de emisión.";
				res.render("./contratos/c5/regContrato", { msg, codAU });
			} else {
				sql = `INSERT into contrato VALUES ('',${codAU},'${femision}','${fvto}',FALSE,'Abierto','${cond}',${porc})`;
				await pool.query(sql);
				msg = "Se ha registrado el contrato exitosamente";
				res.render("./contratos/c5", { msg });
			}
		}
	} catch (err) {
		console.log(err);
		res.render("/c5", { msg: err });
	}
});
export default router;