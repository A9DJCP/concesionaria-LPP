import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c3/b4/registrarSalidaAutomovil", async (req, res) => {
	var codFACC, sql, rs, msg;
	try {
		codFACC = req.body.codFACC;
		sql = `select COUNT(*) cont, P.codPAA codPAA 
    FROM facturaaccesorio F, presupuestoaccesorio P 
    WHERE P.codPAA=F.codPAA and estado='Pago' and codFACC=${codFACC}`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg =
				"El número ingresado no corresponde a una factura existente, es inválido o el presupuesto cuya factura hace referencia ya ha sido registrado como finalizado";
		} else {
			sql = `UPDATE presupuestoaccesorio P, facturaaccesorio F 
            SET estado='Finalizado' 
            WHERE F.codPAA=P.codPAA and estado='Pago' and F.codFACC=${codFACC}`;
			msg =
				"Se ha registrado la finalización del presupuesto correctamente y el automóvil está listo para ser retirado.";
		}
	} catch (err) {
		console.log(err);
		msg = "Ocurrio un error inesperado";
	}
	res.render("./posventa/c3/index", { msg });
});

export default router;
