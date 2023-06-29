import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c1/b5/openRegAuto0km", isLoggedIn, (req, res) => {
	res.render("./compras/c1/regAuto0km");
});

export default router;
