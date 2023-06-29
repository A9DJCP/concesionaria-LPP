import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c1/b6/procPlanDePago", isLoggedIn, (req, res) => {
	try {
	} catch (err) {}
});

export default router;
