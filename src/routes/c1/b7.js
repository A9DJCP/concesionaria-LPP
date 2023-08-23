import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c1/b7/procOrdenRetiro", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var codOR = req.body.codOR;
		sql = `select COUNT(*) cont from retiroauto0km where retirado=1 and codRA0KM=${codOR}`;
		rs = await pool.query(sql);
		if (rs[0].cont === 1) {
			msg =
				"El automóvil correspondiente a la órden de retiro ingresada ya ha sido retirado";
		} else {
			sql = `select COUNT(*) cont from retiroauto0km where retirado=0 and CODRA0KM=${codOR}`;
			rs = await pool.query(sql);
			if (rs[0].cont === 0) {
				msg = "La órden de retiro ingresada es inválida o inexistente.";
			} else {
				sql = `UPDATE retiroauto0km SET retirado=1 where codRA0KM=${codOR}`;
				await pool.query(sql);
				msg = "Se ha registrado el retiro del automóvil exitosamente";
				//Acá se le daría la documentación física al cliente de su automóvil
			}
		}
		res.render("./compras/c1/index", { msg: msg });
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/index", { msg: err });
	}
});

export default router;
