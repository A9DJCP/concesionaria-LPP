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

router.get("/c1", isLoggedIn, (req, res) => res.render("./compras/c1/index"));

router.get("/c2", isLoggedIn, (req, res) => res.render("./posventa/c2/index"));

router.get("/c3", isLoggedIn, (req, res) => res.render("./posventa/c3/index"));

router.get("/c4", isLoggedIn, (req, res) => res.render("./posventa/c4/index"));

// RUTAS DE SECCION DE POSVENTAS

export default router;
