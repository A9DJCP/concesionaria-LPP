import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c6/b3", isLoggedIn, async (req, res) => {
	var sql, msg;
	try {
		var nroF = req.body.nroF;
		sql = `select COUNT(*) cont from facturacompraautousado where estado='Pendiente' and codFCAU=${nroF}`;
		if ((await pool.query(sql))[0].cont === 0) {
			msg =
				"El número de factura ingresado es inválido o no corresponde a una factura pendiente a pagar.";
			//Refresh
		} else {
			await pool.query(
				`UPDATE facturacompraautousado set estado='Paga' where codFCAU=${nroF}`
			);
			msg = "Se ha actualizado el pago de la factura.";
		}
		res.render("./compras/c6", { msg });
	} catch (err) {
		console.log(err);
		res.render("./compras/c6", { msg: err });
	}
});

export default router;
