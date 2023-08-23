import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c1/b5/openRegAuto0km", isLoggedIn, (req, res) => {
	res.render("./compras/c1/regAuto0km");
});

router.post("/c1/b5/regDoc", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var modelo = req.body.modelo;
		var marca = req.body.marca;
		var matricula = req.body.matricula;
		var uso = req.body.uso;
		var chasis = req.body.chasis;
		var motor = req.body.motor;
		var codDF = req.body.nroDocF;
		var yearF = req.body.yearF;
		var fvto = req.body.fvto;
		var titular = req.body.titular;
		var tdoc = req.body.tdoc;
		var ndoc = req.body.ndoc;
		var domicilio = req.body.domicilio;
		var color = req.body.color;
		var codF = req.body.codF;

		//typeof void data is String
		if (
			modelo === "" ||
			marca === "" ||
			matricula === "" ||
			uso === "" ||
			chasis === "" ||
			motor === "" ||
			codDF === "" ||
			yearF === "" ||
			fvto === "" ||
			titular === "" ||
			tdoc === "" ||
			ndoc === "" ||
			domicilio === "" ||
			color === "" ||
			codF === ""
		) {
			msg =
				"Ingrese todos los datos válidos necesarios para realizar el registro de la documentación.";
		} else {
			sql = `select COUNT(*) cont 
			FROM docauto0km DA, auto0km A, docfabricacion DF 
			WHERE DF.codDF=DA.codDF AND A.codda0km=DA.codDA0km AND DF.codDF=${codDF}`;
			rs = await pool.query(sql);
			if (rs[0].cont === 1) {
				msg =
					"El código de documentación de fabricación ingresado corresponde a una documentación ya registrada.";
			} else {
				sql = `select COUNT(*) cont FROM autodisponible0km AD, persona P, cliente C, OrdendeCompra O, docfabricacion DF 
				WHERE P.codper=C.codper AND C.codcl=O.codcl AND O.codad0km=AD.codad0km AND DF.cododc=O.cododc 
				AND tipodoc='${tdoc}' AND nrodoc='${ndoc}' AND marca='${marca}' AND modelo='${modelo}'
				AND color='${color}' AND codDF="${codDF}" AND concat(nom,' ', ape)='${titular}' AND direc='${domicilio}'`;
				rs = await pool.query(sql);
				if (rs[0].cont === 0) {
					msg =
						"Los datos ingresados son inválidos o no coindicen con los que corresponden a la compra.";
				} else {
					//Inserts
					sql = `INSERT INTO docauto0km values ('','${marca}','${modelo}','${matricula}','${uso}','${chasis}',
					'${motor}','${titular}','${tdoc}','${ndoc}','${domicilio}','${fvto}'," ${yearF}",'${color}',"${codDF}",
					'${codF}')`;
					rs = await pool.query(sql);
					sql = `SELECT codad0km codAD FROM autodisponible0km WHERE marca='${marca}' AND modelo='${modelo}' 
					AND color='${color}'`;
					rs = await pool.query(sql);
					var codAD = rs[0].codAD;
					sql = `SELECT Max(codda0km) codDA FROM docauto0km`;
					rs = await pool.query(sql);
					var codDA = rs[0].codDA;
					sql = `SELECT codcl FROM cliente C, persona P WHERE p.codper=C.codper and nrodoc='${ndoc}' and tipodoc='${tdoc}'`;
					rs = await pool.query(sql);
					var codCL = rs[0].codcl;
					sql = `INSERT INTO auto0km values ('',"${codAD}",curdate(),"${codDA}","${codCL}")`;
					await pool.query(sql);
					msg = "Se ha registrado el automóvil exitosamente.";
				}
			}
		}
		res.render("./compras/c1/index", { msg });
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/index", { msg: err });
	}
});
export default router;
