import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c3/b2/registrarPresupuesto", async (req, res) => {
	try {
		var codPAA = req.body.codPAA;
		var sql = `select COUNT(*) cont from presupuestoaccesorio where codPAA=${codPAA} and estado='Pendiente'`;
		var result = await pool.query(sql);
		var cont = result[0].cont;
		if (cont === 0) {
			req.flash(
				"El número de presupuesto es inválido, inexistente o no corresponde a ningún presupuesto de accesorios pendiente."
			);
		} else {
			sql =
				"update presupuestoaccesorio set estado='Aceptado', fechaentrega=(DATE_ADD(curdate(), INTERVAL 15 DAY)) where codPAA=" &
				codPAA;
			await pool.query(sql);
			req.flash(
				"Se ha registrado el presupuesto como aceptado. Se iniciará la operación de agregado de accesorios lo más pronto posible."
			);
		}
	} catch (err) {
		console.log(err);
		req.flash("Ocurrio un error inesperado");
	}
	res.render("./posventa/c3/index");
});

export default router;
