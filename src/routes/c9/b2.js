import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c9/b2/pagarCuota", isLoggedIn, async (req, res) => {
	var sql, rs, data, msg;
	try {
		var codPRE = parseInt(req.body.codPRE);
		sql = `SELECT COUNT(*) cont FROM prestamo WHERE pagado=0 
        AND codPRE=${codPRE} AND codPRE NOT IN (select codPRE from moroso)`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg =
				"El número de préstamo ingresado es incorrecto, el préstamo ya ha sido pagado o ha sido cancelado por morosidad.";
			res.render("./compras/c9/index", { msg });
		} else {
			sql = `select nrocuota, pagada, fcobro, fvto from cuota where codPRE=${codPRE} and pagada=0`;
			rs = await pool.query(sql);
			var cuotas = [];
			rs.forEach((c) =>
				cuotas.push({
					nroCuota: c.nrocuota,
					pagada: c.pagada,
					fcobro: c.fcobro,
					fvto: c.fvto,
				})
			);
			res.render("./compras/c9/pagoCuotas", { msg, codPRE, cuotas });
		}
	} catch (err) {
		console.log(err);
		msg = err;
		res.render("./compras/c9/index", { msg });
	}
});

router.post("/c9/b2/elegirCuota", isLoggedIn, async (req, res) => {
	var sql, rs, data, msg;
	try {
		var nroCuota = parseInt(req.body.codCuota);
		var codPRE = parseInt(req.body.codPRE);
		if (isNaN(nroCuota)) {
			msg = "Debe seleccionar una cuota válida para poder pagar.";
			res.render("./compras/c9/index", { msg });
		}
		sql = `select codCuota from cuota where codPRE=${codPRE} AND nroCuota=${nroCuota}`;
		rs = await pool.query(sql);
		var codCuota = rs[0].codCuota;
		sql = `select COUNT(*) cont from cuota where codPRE=${codPRE} and pagada=0 and nrocuota<${nroCuota}`;
		rs = await pool.query(sql);
		if (rs[0].cont > 0) {
			msg =
				"Para poder pagar una cuota debe primero haber pagado las anteriores a ella.";
			//Obs: Estaria bueno poder recargar la pagina mostrando el mensaje por pantalla pero requiero poder
			// usar una ruta POST sin intervencion del cliente y no se como. Queda pendiente ya que no afecta
			// a la funcionalidad directamente.
			res.render("./compras/c9/index", { msg });
		} else {
			sql = `select COUNT(*) cont from cuota where nrocuota=${nroCuota} and codPRE=${codPRE} and fcobro<=curdate()`;
			rs = await pool.query(sql);
			if (rs[0].cont === 0) {
				msg =
					"No se puede pagar la cuota seleccionada aún (debe esperar a la fecha de cobro).";
				res.render("./compras/c9/index", { msg });
			} else {
				sql = `select precioXcuota from prestamo where codPRE=${codPRE}`;
				rs = await pool.query(sql);
				var precioBase = rs[0].precioXcuota;
				sql = `select porcentaje from porcentaje where descripcion='Interes Cuotas Prestamo'`;
				rs = await pool.query(sql);
				var interes = rs[0].porcentaje;
				sql = `select count(*), fvto cont from cuota where codCuota=${codCuota} and pagada=0 and fvto<curdate()`;
				rs = await pool.query(sql);
				var fvto = rs[0].fvto;
				var cont = rs[0].cont;
				var mesesVencimiento = 0;
				if (cont > 0) {
					sql = `SELECT DATEDIFF(MONTH, GETDATE(), ${fvto}) difMeses`;
					mesesVencimiento = rs[0].difMeses;
				}
				//Si no tiene cuotas adeudadas (sin pagar y con fecha de vencimiento vencida) el interes es 0 y el precio base de la cuota es el precio final.
				//Por cada mes atrasada de la deuda se multiplica el interes. Ej: 1 mes, interes * 1, 2 meses: interes * 2. X meses: interes * x.
				var precioFinal = 1 + mesesVencimiento * (interes / 100) + precioBase;
				sql = `UPDATE cuota set pagada=1 where codCuota=${codCuota}`;
				await pool.query(sql);
				sql = `SELECT nrocuota from cuota where codCuota=${codCuota}`;
				rs = await pool.query(sql);
				var nroCuota = rs[0].nrocuota;
				sql = `SELECT curdate() femision, nom, ape, tipodoc tdoc, nrodoc ndoc, O.codODC codODC, 
					matricula, marca, modelo, cantcuotas, P.codPRE
					FROM Persona Per, cliente C, ordendecompra O, Prestamo P, cuota Cu, docfabricacion DF, docauto0km DA
                    WHERE P.codPRE=${codPRE} AND Per.codPER=C.codPer AND C.codCL=O.codCL AND O.codODC=P.codODC 
					AND Cu.codPRE=P.codPRE AND DF.codODC=O.codODC AND DF.codDF=DA.codDF`;
				rs = await pool.query(sql);
				var labelCliente = rs[0].nom + " " + rs[0].ape;
				var labelDoc = rs[0].tdoc + ": " + rs[0].ndoc,
					data = {
						precioFinal,
						precioBase,
						interes,
						codODC: rs[0].codODC,
						mesesVto: mesesVencimiento,
						femision: rs[0].femision,
						labelCliente,
						labelDoc,
						nroCuota: nroCuota,
						cantCuotas: rs[0].cantcuotas,
						codPRE: rs[0].codPRE,
						marca: rs[0].marca,
						modelo: rs[0].modelo,
						matricula: rs[0].matricula,
					};
				console.log(data);
				res.render("./compras/c9/reciboCuota", { msg, data });
			}
		}
	} catch (err) {
		console.log(err);
		msg = err;
		res.render("./compras/c9/index", { msg });
	}
});

export default router;