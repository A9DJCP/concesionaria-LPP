import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c3/b4/registrarSalidaAutomovil", async (req, res) => {
	try {
		var codFACC = req.body.codFACC;
		var sql = `select COUNT(*) cont, P.codPAA codPAA 
    FROM facturaaccesorio F, presupuestoaccesorio P 
    WHERE P.codPAA=F.codPAA and estado='Pago' and codFACC=${codFACC}`;
		var result = await pool.query(sql);
		var cont = result[0].cont;
		if (cont === 0) {
			req.flash(
				"El número ingresado no corresponde a una factura existente, es inválido o el presupuesto cuya factura hace referencia ya ha sido registrado como finalizado"
			);
		} else {
			sql = `UPDATE presupuestoaccesorio P, facturaaccesorio F 
            SET estado='Finalizado' 
            WHERE F.codPAA=P.codPAA and estado='Pago' and F.codFACC=${codFACC}`;
			req.flash(
				"Se ha registrado la finalización del presupuesto correctamente y el automóvil está listo para ser retirado."
			);
		}
	} catch (err) {
		console.log(err);
		req.flash("Ocurrio un error inesperado");
	}
	res.render("./posventa/c3");
});

export default router;
