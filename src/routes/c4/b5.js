import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c4/b5", isLoggedIn, async (req, res) => {
	var msg, sql, rs, cont, codFREP;
	try {
		//Codigo de la Factura de Reparacion FREP
		codFREP = req.body.codFREP;
		sql = `SELECT COUNT(*) cont, P.codPREP codPREP
        FROM facturareparacion F, presupuestoreparacion P 
        WHERE codFREP=${codFREP} AND estado='Pago' AND F.codPREP=P.codPREP`;
		rs = await pool.query(sql);
		cont = rs[0].cont;
		var codPREP = rs[0].codPREP;
		if (cont == 0) {
			msg =
				"El número de factura que ha ingresado no corresponde a ningun presupuesto pagado o el automóvil ya ha sido retirado.";
		} else {
			sql = `UPDATE presupuestoreparacion SET estado='Finalizado' WHERE codPREP=${codPREP}`;
			await pool.query(sql);
			msg =
				"Se ha registrado la salida del automóvil y está listo para ser retirado.";
		}
	} catch (error) {
		console.log(error);
		msg =
			"El ingreso de datos es invalido. Revise rellenar todos los campos correctamente e intente nuevamente.";
	}
	res.render("./posventa/c4/index", { msg });
});

export default router;
