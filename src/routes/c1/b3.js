import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c1/b3/paySign", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var nroRec = req.body.nroRec;
		sql = `select count(*) cont from recibo where estado='Vigente' and codrec=${nroRec}`;
		rs = await pool.query(sql);
		if (rs[0].cont === 1) {
			sql = `UPDATE recibo set estado='PAGADO' where codrec=${nroRec}`;
			await pool.query(sql);
			msg = `Se ha registrado el pago del recibo ${nroRec} exitosamente`;
		} else {
			msg = "Número de recibo incorrecto, inexistente o ya pago.";
		}
		res.render("./compras/c1", { msg });
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/index", { msg: err });
	}
});

export default router;
