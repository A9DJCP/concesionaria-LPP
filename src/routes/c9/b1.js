import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c9/b1", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		sql = `delete from RevisionPrestamoTemporal`;
		await pool.query(sql);

		sql = `select dayname(curdate()) day`;
		rs = await pool.query(sql);
		// Esta linea de Abajo hay que modificarla. La idea es que se pase desde el menu en gestion de permisos.
		var usuarioActual = "Administrador";
		if (rs[0].day === "Friday") {
			await ejecutarProceso(msg);
			sql = `select count(*) cont, codPRE, cant, monto, tipo FROM RevisionPrestamoTemporal`;
			rs = await pool.query(sql);
			var deudas = [];
			rs.forEach((d) => deudas.push(d.codPRE, d.cant, d.monto, d.tipo));
			console.log(deudas);
			if (rs[0].cont === 0) {
				msg = "Todas las cuotas están al día.";
				res.render("./compras/c9/index", { msg });
			} else {
				res.render("./compras/c9/mostrarDeudores", { msg, deudas });
			}
		} else if (usuarioActual === "Administrador") {
			msg =
				"Advertencia: Este no es un dia de ejecución rutinaria para este proceso (viernes). Se ejecutará de todas formas.";
			await ejecutarProceso(msg);

			sql = `select codPRE, cant, monto, tipo FROM RevisionPrestamoTemporal`;
			rs = await pool.query(sql);
			var deudas = [];
			rs.forEach((d) =>
				deudas.push({
					codPRE: d.codPRE,
					cant: d.cant,
					monto: d.monto,
					tipo: d.tipo,
				})
			);

			if (deudas == []) {
				msg += "Todas las cuotas están al día.";
				res.render("./compras/c9/index", { msg });
			} else {
				res.render("./compras/c9/mostrarDeudores", { msg, deudas });
			}
		} else {
			msg =
				"Este proceso de comprobacion sólo se puede ejecutar los viernes (final de semana).";
			res.render("./compras/c9/index", { msg });
		}
	} catch (err) {
		msg = `Sucedio un error inesperado: ${err}`;
		res.render("./compras/c9/index", { msg });
	}
});

async function ejecutarProceso() {
	var rs, sql;
	sql = `select COUNT(*) cont from cuota where pagada=0 and fvto<curdate()`;
	rs = await pool.query(sql);
	if (rs[0].cont === 0) {
		return [];
	} else {
		sql = `select A.codPRE codPRE,cant,Precio*cant precCant 
        FROM (select codPRE,precioXCuota 'Precio' FROM prestamo) A,
        (select codPRE,COUNT(*) 'cant' FROM cuota where pagada=0 
        AND fvto<curdate() AND codPRE IN (select codPRE FROM prestamo WHERE pagado=0) 
        GROUP BY codPRE) B WHERE A.codPRE=B.codPRE`;
		var array = await pool.query(sql);
		var deudas = [];
		array.forEach((d) => deudas.push(d.codPRE, d.cant, d.precCant));
		var cant, codPRE, precCant;
		for (let i = 0; i < array.length; i++) {
			cant = array[i].cant;
			codPRE = array[i].codPRE;
			precCant = array[i].precCant;
			if (cant >= 6) {
				sql = `select COUNT(*) cont from moroso where codPRE = ${codPRE}`;
				rs = await pool.query(sql);
				//Moroso
				sql = `INSERT into RevisionPrestamoTemporal VALUES ('',${codPRE},${cant},${precCant},'Moroso')`;
				await pool.query(sql);
			} else if (cant > 0) {
				//Informe de Deuda
				sql = `insert into RevisionPrestamoTemporal VALUES ('',${codPRE},${cant},${precCant},'Deudor con cuotas vencidas')`;
				await pool.query(sql);
			}
		}
	}
}

router.post("/c9/b1/imprimirInforme", isLoggedIn, async (req, res) => {
	var sql, rs, data, msg;
	try {
		var codPRE = parseInt(req.body.codPRE);
		if (codPRE === NaN) {
			msg = "Debe seleccionar un prestamo para imprimir su informe";
			res.render("./compras/c9/mostrarDeudores", { msg });
		} else {
			sql = `select cant, monto, tipo FROM RevisionPrestamoTemporal where codPRE = ${codPRE}`;
			rs = await pool.query(sql);
			var cant = parseInt(rs[0].cant);
			var monto = rs[0].monto;
    console.log('Valor de monto:', monto);
	console.log("Valor de cant")
			var tipo = rs[0].tipo;
			if (tipo === "Moroso") {
				sql = `select codCL from prestamo P, ordendecompra O where O.codODC=P.codODC and codPRE=${codPRE}`;
				rs = await pool.query(sql);
				var codCL = rs[0].codCL;
				sql = `INSERT into Moroso Values ('',${codCL},${codPRE},curdate(),0)`;
				await pool.query(sql);
				sql = `UPDATE prestamo set cancelado=1 where codPRE=${codPRE}`;
				await pool.query(sql);
				sql = `select codMOR, fecdeclaracmoroso fecha, P.codPRE codPRE, nom, ape, PER.tipodoc tdoc, nrodoc ndoc,
                marca, modelo, matricula FROM Moroso M, prestamo P, ordendecompra O, cliente C, Persona PER, 
                docfabricacion DF, docauto0km DA WHERE codMOR=(select max(codMOR) from moroso) AND DA.codDF=DF.codDF 
                AND DF.codODC=O.codODC AND C.codCL=O.codCL AND C.codCL=M.codCL AND P.codODC=O.codODC 
                AND Per.codPer=C.codPer`;
				rs = await pool.query(sql);
				var labelCliente = rs[0].nom + " " + rs[0].ape;
				var labelDoc = rs[0].tdoc + ": " + rs[0].ndoc;
				var labelAuto =
					rs[0].marca +
					" " +
					rs[0].modelo +
					" (Matricula: " +
					rs[0].matricula +
					")";

				var labelDoc = rs[0].tdoc + ": " + rs[0].ndoc;
				var data = {
					codMOR: rs[0].codMOR,
					cant: cant,
					fecha: rs[0].fecha,
					codPRE: rs[0].codPRE,
					labelCliente: labelCliente,
					labelDoc: labelDoc,
					labelAuto: labelAuto,
				};
				sql = `SELECT porcentaje FROM porcentaje WHERE descripcion='Interes Cuotas Prestamo'`;
				rs = await pool.query(sql);
				var interes = rs[0].porcentaje;
				sql = `SELECT precioXcuota FROM prestamo WHERE codPRE=${codPRE}`;
				rs = await pool.query(sql);
				var montoDeuda = rs[0].precioXcuota * (1 + interes / 100) * cant;
				data = { ...data, interes: interes, montoDeuda: montoDeuda };
				sql = `delete from RevisionPrestamoTemporal where codPRE=${codPRE}`;
				await pool.query(sql);
				res.render("./compras/c9/informeMoroso", { msg, data });
			} else {
				sql = `SELECT nom, ape, tipodoc tdoc, nrodoc ndoc,curdate() fecha 
                FROM Persona Per, cliente Cl, ordendecompra O, prestamo P, cuota C
                WHERE Per.codPer=Cl.codPer AND Cl.codCL=O.codCL AND O.codODC=P.codODC 
                AND C.codPRE=P.codPRE AND P.codPRE=${codPRE} group by P.codPRE`;
				rs = await pool.query(sql);
				var labelDoc = rs[0].tdoc + ": " + rs[0].ndoc;
				var cliente = rs[0].nom + " " + rs[0].ape;
				var fechaObjeto = new Date(rs[0].fecha);
				const year = fechaObjeto.getFullYear();
				const mes = fechaObjeto.getMonth() + 1;
				const dia = fechaObjeto.getDate();
				const fechaFormateada = `${year}/${mes < 10 ? "0" : ""}${mes}/${dia < 10 ? "0" : ""
					}${dia}`;
				sql =
					"select porcentaje from porcentaje where descripcion='Interes Cuotas Préstamo'";
				rs = await pool.query(sql);
				var interes = rs[0].porcentaje;
				sql = `select precioXcuota from prestamo where codPRE=${codPRE}`;
				rs = await pool.query(sql);
				var subTotal = rs[0].precioXcuota * cant;
				var montoTotal = subTotal * (1 + interes / 100) * cant;
				sql = `delete from RevisionPrestamoTemporal where codPRE=${codPRE}`;
				await pool.query(sql);
				data = {
					cant: cant,
					codPRE: codPRE,
					cliente: cliente,
					labelDoc: labelDoc,
					fecha: fechaFormateada,
					interes: interes,
					subTotal: subTotal,
					montoTotal: montoTotal,
				};
				console.log(data);
				res.render("./compras/c9/avisoDeuda", { msg, data });
			}
		}
	} catch (err) {
		console.log(err);
		msg = err;
		res.render("./compras/c9/index", { msg });
	}
});

export default router;