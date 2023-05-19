import { Router } from "express"; //Importo router para poder usarlo en lugar del app.

const router = Router(); //Enrutador

//RUTAS DE EXPRESS

router.get("/logIn", (req, res) => res.render("logIn"));

router.get("/", (req, res) => res.render("logIn")); //Al no añadirle la extension al index se toma como .ejs

router.get("/menu", (req, res) => res.render("mainMenu"));

router.get("/about", (req, res) =>
	res.render("about", { title: "Sobre Nosotros" })
);

router.get("/contact", (req, res) =>
	res.render("contact", { title: "Contact Page" })
);

export default router;
