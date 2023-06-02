import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import passport from "passport";
import { isLoggedIn } from "../lib/auth.js";
const router = Router(); //Enrutador
import database from "../database.js";
const pool = database;

//RUTAS DE EXPRESS

router.get("/logIn", (req, res) => res.render("logIn"));

router.get("/", (req, res) => res.render("logIn")); //Al no añadirle la extension al index se toma como .ejs

router.get("/menu", isLoggedIn, (req, res) => res.render("mainMenu"));

router.get("/about", isLoggedIn, (req, res) =>
	res.render("about", { title: "Sobre Nosotros" })
);

router.get("/contact", isLoggedIn, (req, res) =>
	res.render("contact", { title: "Contact Page" })
);

// RUTAS DE MENU PRINCIPAL

router.get("/c2", isLoggedIn, (req, res) =>
	res.render("./posventa/reclamoReparacion/index")
);

router.get("/c3", (req, res) => res.render("./posventa/VentaAccesorios/index"));

router.get("/c4", (req, res) =>
	res.render("./posventa/reparacionesFueraGarantia/index")
);

// RUTAS DE SECCION DE POSVENTAS

// RUTAS DE CIRCUITO 2 - RECLAMO REPARACION AUTO 0KM

//BOTON 1
router.get("/c2/b1/procRep0km", isLoggedIn, (req, res) => {
	res.render("./posventa/reclamoReparacion/formularioReparacion");
});

//BOTON 2
router.get("/c2/b2/procInfAcces", isLoggedIn, async (req, res) => {
	banderin = False;
	codigoDeFabrica = req.flash("Ingrese el código de fábrica del automóvil");
	(sql =
		"select COUNT(*), A.codA0KM from docauto0km DA, auto0KM A, analisisauto0km AA where AA.codA0KM=A.codA0KM and DA.codDA0KM=A.codDA0KM and estado='Análisis en progreso' and codigodefabrica='"),
		codigodefabrica,
		"'";
	const resultSet = await pool.query(sql);
	if (rs[0].count == 0) {
		alert(
			"El código ingresado es inválido o no corresponde a un automóvil en análisis."
		);
	} else {
		(sql =
			"update analisisauto0km set estado='Análisis Finalizado' where codA0KM="),
			rs[0].codA0KM,
			" and estado='Análisis en progreso'";
		await pool.query(sql);
		res.redirect("./posventa/reclamoReparacion/procesarInformeAccesorios");
	}
});

router.get("/c2/b2/selecRep", isLoggedIn, (req, res) => {
	res.redirect("./posventa/reclamoReparacion/seleccionarReparaciones.ejs");
});

router.get("/c2/b2/impDocRep", isLoggedIn, (req, res) => {
	res.redirect("./posventa/reclamoReparacion/docReparacion");
});

//EL BOTON 3 NO REDIRIGE A NUEVAS PAGINAS

export default router;
