import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c1/b4/openRegDocF", isLoggedIn, (req, res) => {
	res.render("./compras/c1/regDocF");
});

router.post("/c1/b4/regDocF", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var codODC = req.body.codODC;
		var fechaEmision = req.body.fechaEmision;
		var fechaEntrega = req.body.fechaEntrega;
		sql = `select COUNT(*) cont from ordendecompra where vigente=1 and cododc=${codODC}`;
		rs = await pool.query(sql);
		if (rs[0].cont === 1) {
			// La orden de compra existe y esta vigente
			sql = `select COUNT(*) cont from docfabricacion where cododc=${codODC}`;
			rs = await pool.query(sql);
			if (rs[0].cont === 0) {
				// La orden de compra no tiene una doc. de fabricacion todavia
				if (fechaEmision > fechaEntrega) {
					msg = "La fecha de entrega no puede ser menor a la de emision.";
				} else {
					// Format(dtpFemision.Value, "yyyy/MM/dd")
					sql = `insert into docfabricacion values ('',${codODC},'${fechaEmision}','${fechaEntrega}')`;
					await pool.query(sql);
					msg = "La documentacion se ha registrado correctamente";
				}
			} else {
				//La orden de compra ya tiene una doc de fabricacion.
				msg =
					"La orden de compra ya tiene una documentacion de fabricacion registrada";
			}
		} else {
			//La orden de compra no existe o no esta vigente
			msg = "La orden de compra es invalida";
		}
		res.render("./compras/c1", { msg });
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/index", { msg: err });
	}
});

export default router;
