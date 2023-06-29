import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

function cargarAutos() {
	var autos = [];

	return autos;
}

router.get("/c1/b1/verifCliente", isLoggedIn, (req, res) => {
	res.render("./compras/c1/verifCliente", { enable: false });
});

router.post("/comprobarCliente", isLoggedIn, async (req, res) => {
	var msg, sql, rs;
	try {
		var nom = req.body.nom;
		var ape = req.body.ape;
		var tdoc = req.body.tdoc;
		var ndoc = req.body.ndoc;
		var data = { nom, ape, tdoc, ndoc };

		if (nom == null || ape == null || tdoc == null || ndoc == null) {
			msg =
				"Los datos ingresados son insuficientes para poder realizar la verificación.";
			res.render("./compras/c1/verifCliente", { enable: false, msg });
		} else {
			sql = `SELECT count(*) cont from cliente C, persona P 
            WHERE P.codPer=C.codper AND tipodoc='${tdoc}' AND nrodoc='${ndoc}' 
            AND nom='${nom}' AND ape='${ape}' AND P.borrado=0 AND C.borrado=0`;
			rs = await pool.query(sql);
			if (rs[0].cont === 1) {
				//El cliente se ha verificado
				msg = "El cliente se ha verificado";
				var autos = cargarAutos();
				res.render("./compras/c1/compras", { autos });
			} else {
				//El cliente no esta registrado como Cliente
				//Verifico si esta registrado como persona
				sql = `SELECT COUNT(*) cont FROM persona WHERE borrado=0 
                AND tipodoc='${tdoc}' AND nrodoc='${ndoc}' AND nom='${nom}' AND ape='${ape}'`;
				rs = await pool.query(sql);
				//Modificion a la logica del sistema: Ya sea que el cliente este o no registrado como persona. Mientras no este registrado como cliente se pediran el resto de los datos y luego se verificara antes de hacer el insert si existe o no la persona ya
				msg =
					"Ingrese los datos necesarios restantes para poder registrar al cliente.";
				res.render("./compras/c1/verifCliente", { enable: true, msg, data });
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/verifCliente", { enable: false, msg: err });
	}
});

router.post("/ingresarCliente", isLoggedIn, async (req, res) => {
	var sql = `
		"select COUNT(*) from persona where borrado=0 and tipodoc='" &
		txtTipoDoc.Text &
		"' and nrodoc='" &
		txtNroDoc.Text &
		_);
	"' and nom='" & txtNom.Text & "' and ape='" & txtApe.Text & "'"`; //Consulta para ver si el cliente existe como persona
	if (true) {
		//Si no existe hacer el insert en persona
	}
});

router.get("/c1/b1/compra", isLoggedIn, (req, res) => {});
router.get("/c1/b1/impOrd", isLoggedIn, (req, res) => {});

export default router;
