import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";
router.get("/c5/b3", isLoggedIn, (req, res) => {
	res.render("./contratos/c5/regFirma");
});

router.post("/c5/b3/regFirma", isLoggedIn, async (req, res) => {
	var msg, data, rs, sql;
	try {
		var nom = req.body.nom;
		var ape = req.body.ape;
		var tdoc = req.body.tdoc;
		var ndoc = req.body.ndoc;
		var codAU = req.body.codAU;
		var femision = req.body.femision;
		if (!nom || !ape || !tdoc || !ndoc || !codAU || !femision) {
			msg =
				"Debe completar todos los datos para poder procesar la informacion.";
			res.render("./contratos/c5/regFirma", { msg });
		} else {
			sql = `SELECT COUNT(*) cont, codC FROM persona Per, propietario P, autousado A, contrato C 
            WHERE C.codAU=A.codAU AND A.codP=P.codP AND P.codper=Per.Codper AND nom='${nom}' 
            AND ape='${ape}' AND A.codAU=${codAU} AND nrodoc='${ndoc}' AND tipodoc='${tdoc}' AND estado='Abierto'
            AND firmado=0 and femision='${femision}'`;
			rs = await pool.query(sql);
			var cont = rs[0].cont;
			var codC = rs[0].codC;
			if (cont === 0) {
				msg =
					"Los datos ingresados son inválidos o no corresponden a un contrato abierto sin firmar.";
			} else {
				sql = `update contrato set firmado=1 where codC=${codC}`;
				await pool.query(sql);
				msg = "Se ha registrado la firma del contrato.";
			}
			res.render("./contratos/c5/index", { msg });
		}
	} catch (err) {
		console.log(err);
	}
});

export default router;