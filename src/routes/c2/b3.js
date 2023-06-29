//EL BOTON 3 NO REDIRIGE A NUEVAS PAGINAS
import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
import pool from "../../database.js";
const router = Router();
import flash from "connect-flash";
router.use(flash());

router.post("/entregaAutomovil", isLoggedIn, async (req, res) => {
	let nRep, msg;
	try {
		nRep = parseInt(req.body.nRep);
		var sql = `	select COUNT(*) cont from docreparacion0km where retirado=0 and codDR=${nRep}`;
		var result = await pool.query(sql);
		var cont = result[0].cont;
		if (cont >= 1) {
			msg = "Se ha registrado el retiro del automóvil.";
			var sql = `	UPDATE docreparacion0km set retirado=1 where codDR=${nRep}`;
			await pool.query(sql);
		} else {
			msg =
				"El numero ingresado no corresponde a una documentacion de reparacion valida";
			// Ver de usar req.flash
		}
	} catch (error) {
		msg = "Los datos ingresados son invalidos";
		console.log(error);
	}
	res.render("./posventa/c2/index", { msg });
});

export default router;
