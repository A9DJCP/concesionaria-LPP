import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c4/b3", isLoggedIn, async (req, res) => {
	var msg, sql, rs, cont, codPREP;
	try {
		codPREP = req.body.codPREP;
		sql = `SELECT COUNT(*) cont FROM presupuestoreparacion 
        WHERE codPREP=${codPREP} AND estado='Pendiente'`;
		rs = await pool.query(sql);
		cont = rs[0].cont;
		if (cont == 0) {
			msg =
				"El número de presupuesto ingresado es inválido, inexistente o no corresponde a un presupuesto pendiente para su aceptación.";
		} else {
			sql = `UPDATE presupuestoreparacion SET estado='Aceptado', 
            fechaentrega=(DATE_ADD(curdate(), INTERVAL 15 DAY)) 
            WHERE codPREP=${codPREP}`;
			await pool.query(sql);
			sql = `select fechaentrega from presupuestoreparacion where codPREP=${codPREP}`;
			rs = await pool.query(sql);
			var fecha = rs[0].fechaentrega;
			msg = `Se ha registrado la aceptación del presupuesto. La fecha de entrega del automóvil reparado es el ${fecha}`;
		}
	} catch (error) {
		console.log(error);
		msg =
			"El ingreso de datos es invalido. Revise rellenar todos los campos correctamente e intente nuevamente.";
	}
	res.render("./posventa/c4/index", { msg });
});

export default router;
