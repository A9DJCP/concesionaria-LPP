import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c2/b2/procInfAcces", isLoggedIn, async (req, res) => {
	var sql, codF, rs, cont, codA;
	try {
		codF = req.body.codF;
		res.locals.codF = codF;
		sql = `select COUNT(*) cont, A.codA0KM codA from docauto0km DA, auto0KM A, analisisauto0km AA 
		WHERE AA.codA0KM=A.codA0KM AND DA.codDA0KM=A.codDA0KM AND estado='Analisis en progreso' 
		AND codigodefabrica='${codF}'`;
		rs = await pool.query(sql);
		cont = rs[0].cont;
		codA = rs[0].codA;
		if (cont == 0) {
			res.render("./posVenta/c2/index", {
				msg: "El código ingresado es inválido o no corresponde a un automóvil en análisis",
			});
		} else {
			sql = `UPDATE analisisauto0km SET estado='Analisis Finalizado' where codA0KM= ${codA}
			AND estado='Analisis en progreso'`;
			await pool.query(sql);
			codF = res.locals.codF;
			var sql = `SELECT nombre, fechapedido, fechaentrega, cant 
			FROM detallepresupuestoaccesorio DPA, accesorio A, presupuestoaccesorio PA, auto0KM AA, docauto0KM DA 
			WHERE PA.codPAA=DPA.codPAA AND DPA.codACC=A.codACC AND AA.codA0KM=PA.codA0KM AND AA.codDA0KM=DA.codDA0KM 
			AND codigodefabrica='${codF}'`;
			var accesorios = await pool.query(sql);
			var array = [];
			accesorios.forEach((a) =>
				array.push({
					nom: a.nombre,
					fecha: a.fechapedido,
					entrega: a.fechaentrega,
					cant: a.cant,
				})
			);
			res.render("./posventa/c2/procesarInformeAccesorios", {
				codF,
				accesorios: array,
				codA,
			});
		}
	} catch (err) {
		res.render("./posVenta/c2/index", { msg: "Ocurrió un error inesperado" });
	}
});

router.post("/c2/b2/selecRep", async (req, res) => {
	var sql;
	try {
		var codA = req.body.codA;
		req.flash("El automóvil es apto para la reparación.");
		sql = `DELETE from TempSelectReparacion`;
		await pool.query(sql);
		sql = `SELECT codRDISP, nombre, PU, detalles from reparaciondisponible where borrado=0`;
		var reparaciones = await pool.query(sql);
		var array = [];
		reparaciones.forEach((v) => array.push(v.reparacion));
		var array2 = [];
		for (let i = 0; i < reparaciones.length; i++) {
			array2.push({
				codRDISP: reparaciones[i]["codRDISP"],
				nombre: reparaciones[i]["nombre"],
				PU: reparaciones[i]["PU"],
				detalles: reparaciones[i]["detalles"],
			});
		}
		res.render("./posventa/c2/seleccionarReparaciones", {
			enable: true,
			reparaciones: array2,
			codA,
		});
	} catch (err) {
		console.log(err);
		res.render("./posventa/c2/index", { msg: "Sucedio un error inesperado" });
	}
});

router.post("/c2/b2/anular", async (req, res) => {
	try {
		var codA = req.body.codA;
		console.log(codA);
		console.log(req.body);
		var sql = `UPDATE seguro0km SET estado='No Vigente' where codA0KM=${codA}`;
		await pool.query(sql);
		res.render("./posVenta/c2/index", {
			msg: "El Automóvil no es apto para las reparaciones de su seguro. Se declarará la vigencia del seguro como anulada.",
		});
	} catch (err) {
		console.log(err);
		res.render("./posVenta/c2/index", { msg: "Ocurrió un error inesperado" });
	}
});

router.post("/c2/b2/avanzarAImpresionDocRep", async (req, res) => {
	var sql, msg, rs;
	try {
		var codA = parseInt(req.body.codA);
		var reparaciones = JSON.parse(req.body["datos-reparaciones"]);
		if (reparaciones.length === 0) {
			msg = "No se ha seleccionado ninguna reparación.";
			res.render("./posventa/c2/index", { msg });
		} else {
			var monto = 0;
			for (let i = 0; i < reparaciones.length; i++) {
				monto += parseFloat(reparaciones[i]["PU"]);
			}

			rs = await pool.query(
				"select DATE_ADD(curdate(), INTERVAL 15 DAY) fecha, curdate() hoy"
			);
			var fechaMax = rs[0].fecha;
			var fechaHoy = rs[0].hoy;
			sql = `INSERT into docreparacion0km VALUES ('',${codA},curdate(),DATE_ADD(curdate(), INTERVAL 15 DAY),${monto},0)`;
			await pool.query(sql);
			sql = `select MAX(codDR) codDR from docreparacion0km where codA0KM = ${codA}`;
			rs = await pool.query(sql);
			var codDR = rs[0].codDR;
			var precio, codRDISP;
			for (let i = 0; i < reparaciones.length; i++) {
				codRDISP = reparaciones[i]["codRDISP"];
				precio = reparaciones[i]["PU"];
				sql = `INSERT into detallereparacion0km VALUES ('',${codDR},${codRDISP},${precio})`;
				await pool.query(sql);
			}

			sql = `select P.nom nom, P.ape ape, P.tipodoc tdoc, P.nrodoc ndoc, DA.marca marca, DA.modelo modelo, DA.matricula mat, S.codS0KM codS, TS.nombre nomSeguro
			from persona P, cliente C, ordendecompra O, docfabricacion DF, docauto0km DA, auto0km A, seguro0km S, docreparacion0km DR, tiposeguro TS
			where P.codPer=C.codper and C.codCL=O.codCL and DF.codODC=O.codODC and DA.codDF=DF.codDF and A.codDA0KM=DA.codDA0KM and S.codA0KM=A.codA0KM and DR.codA0KM=A.codA0KM
			and TS.codTS=S.codTS and DR.codDR=${codDR}`;
			rs = await pool.query(sql);
			var lblAuto =
				rs[0].marca + " " + rs[0].modelo + " // Matricula: " + rs[0].mat;
			var lblCliente = rs[0].nom + " " + rs[0].ape;
			var lblDoc = rs[0].tdoc + ": " + rs[0].ndoc;
			var montoLetras = transcribirNumeroALetras(monto);
			var data = {
				lblCliente,
				lblDoc,
				lblAuto,
				montoLetras,
				fechaMax,
				fechaHoy,
				monto,
				reparaciones,
				codDR,
				codA,
			};
			res.render("./posventa/c2/docReparacion", { data });
		}
	} catch (err) {
		sql = `UPDATE analisisauto0km set estado = 'Analisis en progreso'
		WHERE codAA0KM = (select MAX(codAA0KM) from analisisauto0km); `;
		await pool.query(sql);
		msg = "Error inesperado: " + err;
		console.log(err);
		res.render("./posventa/c2/index", { msg });
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
