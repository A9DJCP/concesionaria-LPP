import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";
router.post("/c6/b6", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var codORPAG = req.body.codORPAG;
		sql = `select COUNT(*) cont, codC FROM ordenpago WHERE estado='Pendiente' AND fvto>=curdate() 
        AND codORPAG=${codORPAG}`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg =
				"La órden de pago ingresada es inválida, ya ha sido cobrada o está vencida.";
			//Refresh
		} else {
			var codC = rs[0].codC;
			await pool.query(
				`UPDATE contrato set estado='Cerrado con exito' where codC=${codC}`
			);
			await pool.query(
				`UPDATE ordenpago set estado='Paga', fechacobro=curdate() WHERE codORPAG=${codORPAG}`
			);
			msg =
				"Se ha registrado el cobro de la órden de pago y la finalización del contrato.";
		}
		res.render("./compras/c6/index", { msg });
	} catch (err) {
		console.log(err);
		res.render("./compras/c6/index", { msg: err });
	}
});
export default router;
