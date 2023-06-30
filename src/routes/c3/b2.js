import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c3/b2/registrarPresupuesto", async (req, res) => {
	var msg, sql, rs, codPAA;
	try {
		codPAA = req.body.codPAA;
		sql = `select COUNT(*) cont from presupuestoaccesorio where codPAA=${codPAA} and estado='Pendiente'`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg =
				"El número de presupuesto es inválido, inexistente o no corresponde a ningún presupuesto de accesorios pendiente.";
		} else {
			sql = `UPDATE presupuestoaccesorio SET estado='Aceptado', 
			fechaentrega=(DATE_ADD(curdate(), INTERVAL 15 DAY)) where codPAA=${codPAA}`;
			await pool.query(sql);
			msg =
				"Se ha registrado el presupuesto como aceptado. Se iniciará la operación de agregado de accesorios lo más pronto posible.";
		}
	} catch (err) {
		console.log(err);
		msg = "Ocurrio un error inesperado";
	}
	res.render("./posventa/c3/index", { msg });
});

export default router;
