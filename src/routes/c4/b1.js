import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c4/b1", isLoggedIn, (req, res) => {
	res.render("./posventa/c4/solRep");
});

router.post("/c4/b1/registrar", isLoggedIn, async (req, res) => {
	let matricula, marca, modelo, codF, codS;
	var sql, rs, existe, msg, codA;
	try {
		matricula = req.body.matricula;
		marca = req.body.marca;
		modelo = req.body.modelo;
		codF = req.body.codfabrica;
		codS = parseInt(req.body.numseguro);
		if (codS === NaN) {
			codS = -1;
		}

		sql = `select COUNT(*) cont, A.codA0KM codA 
        FROM Auto0km A, seguro0km S, docAuto0km DA 
        WHERE S.codA0KM=A.codA0KM AND DA.codDA0KM=A.codDA0KM AND codigodefabrica='${codF}' 
        AND marca='${marca}' AND modelo='${modelo}' AND matricula='${matricula}' 
        AND codS0KM=${codS} AND estado='No Vigente'`;
		rs = await pool.query(sql);
		existe = rs[0].cont;
		if (existe == 0) {
			msg =
				"Los datos ingresados son inválidos o no corresponden a un automóvil cuyo seguro no esté vigente (si este es el caso debe realizar la reparacion dentro del circuito de garantía).";
		} else {
			codA = rs[0].codA;
			sql = `SELECT COUNT(*) cont FROM analisisreparacionauto AR, auto0KM A, docauto0km DA
            WHERE estado='Análisis en Progreso' AND codigodefabrica='${codF}' AND 
            AR.codA0KM=A.codA0KM AND DA.codDA0KM=A.codDA0KM`;
			rs = await pool.query(sql);
			existe = rs[0].cont;
			if (existe >= 1) {
				msg =
					"El automóvil ya se encuentra registrado como en análisis en progreso.";
			} else {
				sql = `INSERT into analisisreparacionauto 
                VALUES ('', ${codA},curdate(),'Analisis en Progreso')`;
				await pool.query(sql);
				msg =
					"El automóvil ha sido registrado y está listo para ser enviado al taller y analizarlo.";
			}
		}
	} catch (error) {
		console.log(error);
		msg =
			"El ingreso de datos es invalido. Revise rellenar todos los campos correctamente e intente nuevamente.";
	}
	res.render("./posventa/c4/index", { msg });
});

export default router;
