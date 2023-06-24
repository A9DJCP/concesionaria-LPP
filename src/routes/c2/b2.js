import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";
//BOTON 2

var codF;

router.post("/c2/b2/procInfAcces", isLoggedIn, async (req, res) => {
	try {
		codF = req.body.codF;
		var sql = `select COUNT(*) cont, A.codA0KM from docauto0km DA, auto0KM A, analisisauto0km AA 
		WHERE AA.codA0KM=A.codA0KM AND DA.codDA0KM=A.codDA0KM AND estado='Analisis en progreso' 
		AND codigodefabrica='${codF}'`;
		const rs = await pool.query(sql);
		var cont = rs[0].cont;
		if (cont == 0) {
			res.render("./posVenta/c2/index", {
				msg: "El código ingresado es inválido o no corresponde a un automóvil en análisis",
			});
		} else {
			sql = `UPDATE analisisauto0km SET estado='Analisis Finalizado' where codA0KM= ${rs[0].codA0KM}
			AND estado='Analisis en progreso'`;
			await pool.query(sql);
			// "Estado del automovil actualizado: Analisis en progreso ===> Analisis Finalizado"
			res.redirect("/c2/b2/cargarAccess");
		}
	} catch (err) {
		res.render("./posVenta/c2/index", { msg: "Ocurrió un error inesperado" });
	}
});

router.get("/c2/b2/cargarAccess", isLoggedIn, async (req, res) => {
	var sql = `SELECT nombre, fechapedido, fechaentrega, cant 
	FROM detallepresupuestoaccesorio DPA, accesorio A, presupuestoaccesorio PA, auto0KM AA, docauto0KM DA 
	WHERE PA.codPAA=DPA.codPAA AND DPA.codACC=A.codACC AND AA.codA0KM=PA.codA0KM AND AA.codDA0KM=DA.codDA0KM 
	AND codigodefabrica='${codF}'`;
	var accesorios = await pool.query(sql);
	var array = [];
	accesorios.forEach((v) => array.push(v.accessorio));
	res.render("./posventa/c2/procesarInformeAccesorios", {
		codF,
		accesorios: array,
	});
});

router.get("/c2/b2/selecRep", async (req, res) => {
	try {
		req.flash("El automóvil es apto para la reparación.");
		var sql = `SELECT codA0KM auto FROM docauto0KM DA, auto0km A 
		WHERE A.codDA0KM=DA.codDA0KM AND codigodefabrica='${codF}'`;

		//Chequear cargar las reparaciones en base al seguro que tiene el auto para dar uso al var auto
		const rs = await pool.query(sql);
		var auto = rs[0].auto;
		sql = `DELETE from TempSelectReparacion`;
		await pool.query(sql);
		sql = `SELECT codRDISP, nombre, PU, detalles from reparaciondisponible where borrado=0`;
		var reparaciones = await pool.query(sql);
		var array = [];
		reparaciones.forEach((v) => array.push(v.reparacion));
		var array2 = [];
		for (let i = 0; i < reparaciones.length; i++) {
			array2.push({
				codRDISP: reparaciones[i]["codRDISP"],
				nombre: reparaciones[i]["nombre"],
				PU: reparaciones[i]["PU"],
				detalles: reparaciones[i]["detalles"],
			});
		}

		res.render("./posventa/c2/seleccionarReparaciones", {
			codF,
			enable: true,
			reparaciones: array2,
		});
	} catch (err) {
		res.render("./posventa/c2/index", { msg: "Sucedio un error inesperado" });
	}
});

router.get("/c2/b2/anular", async (req, res) => {
	try {
		//FALTA CHEQUEAR EL CAMBIO DE LA VIGENCIA DEL SEGURO
		var sql = `SELECT codA0KM FROM docAUto0km dA, auto0km A 
			WHERE A.codDA0KM=DA.codDA0KM AND codigodefabrica='${codF}'`;
		const rs = await pool.query(sql);
		var auto = rs[0].codA0KM;
		sql = `UPDATE seguro0km SET estado='No Vigente' where codA0KM=${auto}`;
		await pool.query(sql);
		res.render("./posVenta/c2/index", {
			msg: "El Automóvil no es apto para las reparaciones de su seguro. Se declarará la vigencia del seguro como anulada.",
		});
	} catch (err) {
		res.render("./posVenta/c2/index", { msg: "Ocurrió un error inesperado" });
	}
});

// router.get("/c2/b2/impDocRep", isLoggedIn, (req, res) => {
// 	res.redirect("./posventa/reclamoReparacion/docReparacion");
// });

export default router;
