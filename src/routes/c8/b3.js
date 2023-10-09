import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c8/b3", isLoggedIn, async (req, res) => {
	try {
		var sql, msg;
		var codR = req.body.codR;
		sql = `select COUNT(*) cont from retiro where codR=${codR} and estado='Pendiente' and fvto>curdate()`;
		if ((await pool.query(sql))[0].cont === 0) {
			msg =
				"La órden de retiro ingresada es inválida, ya fue retirado el automóvil correspondiente o está vencida.";
		} else {
			sql = `update retiro set estado='Retirado' where codR=${codR}`;
			await pool.query(sql);
			msg =
				"Se ha registrado la salida del automóvil. Puede proceder su propietario a retirarlo.";
		}
		res.render("./contratos/c8", { msg });
	} catch (err) {
		console.log(err);
		res.render("./contratos/c8", { msg: err });
	}
});

export default router;
