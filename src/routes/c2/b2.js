import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
//BOTON 2
router.get("/c2/b2/procInfAcces", isLoggedIn, async (req, res) => {
	try {
		const codF = req.body.codF;
		console.log(codF);
		var sql = `select COUNT(*) cont, A.codA0KM from docauto0km DA, auto0KM A, analisisauto0km AA 
		WHERE AA.codA0KM=A.codA0KM and DA.codDA0KM=A.codDA0KM AND estado='Analisis en progreso' 
		AND codigodefabrica='${codF}'`;
		const rs = await pool.query(sql);
		var cont = rs[0].cont;
		console.log("LLEGUE ACA");
		if (cont == 0) {
			alert(
				"El código ingresado es inválido o no corresponde a un automóvil en análisis."
			);
			res.render("./posVenta/c2/index");
		} else {
			var sql = `UPDATE analisisauto0km set estado='Analisis Finalizado' where codA0KM= ${rs[0].codA0KM}
			" AND estado='Analisis en progreso'`;
			await pool.query(sql);
			alert(
				"Estado del automovil actualizado: Analisis en progreso ===> Analisis Finalizado"
			);
			res.render("./posventa/reclamoReparacion/procesarInformeAccesorios");
		}
	} catch (err) {
		res.render("./posVenta/c2/index");
	}
});

// router.get("/c2/b2/selecRep", isLoggedIn, (req, res) => {
// 	res.redirect("./posventa/reclamoReparacion/seleccionarReparaciones.ejs");
// });

// router.get("/c2/b2/impDocRep", isLoggedIn, (req, res) => {
// 	res.redirect("./posventa/reclamoReparacion/docReparacion");
// });

export default router;
