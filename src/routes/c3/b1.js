import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/consultarAccesorios", async (req, res) => {
	try {
		var codF = req.body.codF;
		var sql = "select SUM(stock) stock from accesorio";
		var result = await pool.query(sql);
		var existe = result[0].stock;
		if (existe === 0) {
			req.flash(
				"Lo sentimos. En este momento no hay stock de los accesorios. Regrese en otro momento para concretar su pedido."
			);
			res.render("./posventa/c3/index");
		} else {
			sql = `select COUNT(*) cont from docauto0km where codigodefabrica= '${codF}'`;
			result = await pool.query(sql);
			existe = result[0].cont;
			if (existe === 0) {
				req.flash(
					"El código ingresado no corresponde a un automóvil 0KM existente registrado en la concesionaria"
				);
				res.render("./posventa/c3/index");
			} else {
				console.log("LLEGUE ACA");
				sql = `select COUNT(*) cont, A.CODA0KM codA0KM 
                FROM docauto0km DA, auto0km A, seguro0km S 
                WHERE DA.codDA0KM=A.codDA0KM and A.codA0KM=S.codA0KM 
                AND codigodefabrica='${codF}' and estado='Vigente'`;
				result = await pool.query(sql);
				var cont = result[0].cont;
				var codA0KM = result[0].codA0KM;
				if (cont === 0) {
					req.flash(
						"El automóvil tiene su seguro vencido por lo que no puede acceder al servicio de venta de accesorios para automóviles 0KM (seguro vencido)."
					);
					res.render("./posventa/c3/index");
				} else {
					req.flash(
						"El automóvil se ha verificado correctamente. Seleccione ahora los accesorios deseados."
					);
					sql = "delete from TempSelectAccesorio";
					await pool.query(sql);
					sql =
						"select codACC, nombre, PU, stock from accesorio where borrado=0 AND stock>0";
					result = await pool.query(sql);
					var accesorios = await pool.query(sql);
					var array = [];
					accesorios.forEach((v) => array.push(v.accesorio));
					var array2 = [];
					for (let i = 0; i < accesorios.length; i++) {
						array2.push({
							codACC: accesorios[i]["codACC"],
							nombre: accesorios[i]["nombre"],
							PU: accesorios[i]["PU"],
							stock: accesorios[i]["stock"],
						});
					}
					console.log(array2);
					res.render("./posventa/c3/seleccionaAccesorio", {
						accesorios: array2,
						codA0KM,
					});
				}
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./posventa/c3/index");
	}
});

export default router;
