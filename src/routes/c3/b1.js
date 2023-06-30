import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/consultarAccesorios", async (req, res) => {
	var msg;
	try {
		var codF = req.body.codF;
		var sql = "select SUM(stock) stock from accesorio";
		var result = await pool.query(sql);
		var existe = result[0].stock;
		if (existe === 0) {
			msg =
				"Lo sentimos. En este momento no hay stock de los accesorios. Regrese en otro momento para concretar su pedido.";
			res.render("./posventa/c3/index", { msg });
		} else {
			sql = `select COUNT(*) cont from docauto0km where codigodefabrica= '${codF}'`;
			result = await pool.query(sql);
			existe = result[0].cont;
			if (existe === 0) {
				msg =
					"El código ingresado no corresponde a un automóvil 0KM existente registrado en la concesionaria";
				res.render("./posventa/c3/index", { msg });
			} else {
				sql = `select COUNT(*) cont, A.CODA0KM codA0KM 
                FROM docauto0km DA, auto0km A, seguro0km S 
                WHERE DA.codDA0KM=A.codDA0KM and A.codA0KM=S.codA0KM 
                AND codigodefabrica='${codF}' and estado='Vigente'`;
				result = await pool.query(sql);
				var cont = result[0].cont;
				var codA = result[0].codA0KM;
				if (cont === 0) {
					msg =
						"El automóvil tiene su seguro vencido por lo que no puede acceder al servicio de venta de accesorios para automóviles 0KM (seguro vencido).";
					res.render("./posventa/c3/index", { msg });
				} else {
					msg =
						"El automóvil se ha verificado correctamente. Seleccione ahora los accesorios deseados.";
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
					res.render("./posventa/c3/seleccionaAccesorio", {
						accesorios: array2,
						codA,
						msg,
					});
				}
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./posventa/c3/index");
	}
});

router.post("/c3/b1/generarPresupuesto", async (req, res) => {
	var sql, msg, rs;
	try {
		var codA = req.body["codA"];
		var accesorios = JSON.parse(req.body["datos-accesorios"]);
		if (accesorios.length === 0) {
			msg =
				"No se ha seleccionado ningun accesorio. Debe seleccionar algún accesorio para poder elaborar el presupuesto";
			res.render("./posventa/c2/index", { msg });
		} else {
			//la fecha de entrega se queda como NULA porque va a tomar el valor al momento de recibir la aceptación del presupuesto.'
			var monto = 0;
			var cantAccesorios = 0;
			for (let i = 0; i < accesorios.length; i++) {
				monto += parseFloat(accesorios[i]["PU"] * accesorios[i]["cant"]);
				cantAccesorios += 1;
			}
			sql = `INSERT into presupuestoaccesorio 
			VALUES ('',curdate(),NULL,${codA},${monto},'Pendiente')`;
			await pool.query(sql);
			sql = `SELECT MAX(codPAA) codPAA FROM presupuestoaccesorio`;
			rs = await pool.query(sql);
			var codPAA = rs[0].codPAA;
			for (let i = 0; i < accesorios.length; i++) {
				sql = `INSERT into detallepresupuestoaccesorio VALUES
				('',${codPAA},${accesorios[i]["codACC"]},${accesorios[i]["cant"]},${accesorios[i]["PU"]})`;
				await pool.query(sql);
			}

			sql = `SELECT nom, ape, P.tipodoc tdoc, nrodoc, marca, modelo, matricula, max(codPAA) codPAA, 
			PA.fechapedido fecha FROM Persona P, cliente C, ordendecompra O, docfabricacion DF, 
			docauto0km DA, auto0km A, PresupuestoAccesorio PA WHERE A.codA0KM=${codA} AND P.codPer=C.codper 
			AND C.codCL=O.codCL AND O.codODC=DF.codODC AND DA.codDF=DF.codDF AND DA.codDA0KM=A.codDA0KM 
			AND PA.codA0KM=A.codA0KM AND codPAA=(select MAX(codPAA) from presupuestoaccesorio)`;
			rs = await pool.query(sql);
			var montoLetras = transcribirNumeroALetras(monto);
			var lblDoc = rs[0].tdoc + ": " + rs[0].nrodoc;
			var marca = rs[0].marca;
			var modelo = rs[0].modelo;
			var mat = rs[0].matricula;
			var fecha = rs[0].fecha;
			var lblCliente = rs[0].nom + " " + rs[0].ape;
			var data = {
				lblCliente,
				lblDoc,
				marca,
				modelo,
				mat,
				codPAA,
				fecha,
				monto,
				accesorios,
				codA,
				montoLetras,
				cantAccesorios,
			};
			res.render("./posventa/c3/imprimirPresupuesto", { data });
		}
	} catch (err) {
		msg = "Error inesperado: " + err;
		console.log(err);
		res.render("./posventa/c3/index", { msg });
	}
});

function transcribirNumeroALetras(numero) {
	const unidades = [
		"",
		"uno",
		"dos",
		"tres",
		"cuatro",
		"cinco",
		"seis",
		"siete",
		"ocho",
		"nueve",
	];
	const especiales = [
		"",
		"once",
		"doce",
		"trece",
		"catorce",
		"quince",
		"dieciséis",
		"diecisiete",
		"dieciocho",
		"diecinueve",
	];
	const decenas = [
		"",
		"diez",
		"veinte",
		"treinta",
		"cuarenta",
		"cincuenta",
		"sesenta",
		"setenta",
		"ochenta",
		"noventa",
	];
	const centenas = [
		"",
		"ciento",
		"doscientos",
		"trescientos",
		"cuatrocientos",
		"quinientos",
		"seiscientos",
		"setecientos",
		"ochocientos",
		"novecientos",
	];

	if (numero === 0) {
		return "cero";
	}

	if (numero < 0) {
		return "menos " + transcribirNumeroALetras(Math.abs(numero));
	}

	let letras = "";

	if (Math.floor(numero / 1000000) > 0) {
		letras +=
			transcribirNumeroALetras(Math.floor(numero / 1000000)) + " millón ";
		numero %= 1000000;
	}

	if (Math.floor(numero / 1000) > 0) {
		letras += transcribirNumeroALetras(Math.floor(numero / 1000)) + " mil ";
		numero %= 1000;
	}

	if (Math.floor(numero / 100) > 0) {
		if (numero === 100) {
			letras += "cien ";
		} else {
			letras += centenas[Math.floor(numero / 100)] + " ";
		}
		numero %= 100;
	}

	if (numero >= 20) {
		letras += decenas[Math.floor(numero / 10)] + " ";
		numero %= 10;
	}

	if (numero > 0 && numero < 10) {
		letras += unidades[numero] + " ";
	} else if (numero >= 10 && numero < 20) {
		letras += especiales[numero - 10] + " ";
	}

	return letras.trim();
}

export default router;
