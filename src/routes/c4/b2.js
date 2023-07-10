import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c4/b2", isLoggedIn, async (req, res) => {
	var msg, rs, sql, codF, cont, codA;
	try {
		codF = req.body.codF;
		sql = `SELECT COUNT(*) cont, A.codA0KM codA 
        FROM analisisreparacionauto AR, auto0km A, docauto0km DA 
        WHERE estado='Analisis en Progreso' AND codigodefabrica='${codF}' 
        AND AR.codA0KM=A.codA0KM AND A.codDA0KM=DA.codDA0KM`;
		rs = await pool.query(sql);
		cont = rs[0].cont;
		codA = rs[0].codA;
		if (cont == 0) {
			msg =
				"El código ingresado es incorrecto o no corresponde a un automóvil en análisis para su reparación.";
			res.render("./posventa/c4/index", { msg });
		} else {
			sql = `UPDATE analisisreparacionauto SET estado='Analisis Finalizado' 
            WHERE codA0KM=${codA}`;
			await pool.query(sql);
			sql = `select COUNT(*) cont 
            FROM presupuestoreparacion WHERE codA0KM=${codA} AND estado='Pendiente'`;
			rs = await pool.query(sql);
			msg =
				"Se ha registrado la finalización del análisis el automóvil. Seleccione las reparaciones necesarias correspondientes.";
			sql = `DELETE FROM TempSelectReparacion`;
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
			res.render("./posventa/c4/selecRep", {
				enable: true,
				reparaciones: array2,
				codA,
			});
		}
	} catch (error) {
		console.log(error);
		msg =
			"El ingreso de datos es invalido. Revise rellenar todos los campos correctamente e intente nuevamente.";
		res.render("./posventa/c4/index", { msg });
	}
});

router.post("/c4/b2/printPres", isLoggedIn, async (req, res) => {
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
			sql = `INSERT into PresupuestoReparacion 
            VALUES ('',"${codA}",curdate(),NULL,${monto},'Pendiente')`;
			await pool.query(sql);
			sql = `INSERT into docreparacion0km VALUES ('',${codA},curdate(),DATE_ADD(curdate(), INTERVAL 15 DAY),${monto},0)`;
			await pool.query(sql);
			sql = `select MAX(codPREP) codPREP from presupuestoreparacion where codA0KM = ${codA}`;
			rs = await pool.query(sql);
			var codPREP = rs[0].codPREP;
			var precio, codRDISP;
			for (let i = 0; i < reparaciones.length; i++) {
				codRDISP = reparaciones[i]["codRDISP"];
				precio = reparaciones[i]["PU"];
				sql = `INSERT into detallepresupuestoreparacion VALUES ('',${codPREP},${codRDISP},${precio})`;
				await pool.query(sql);
			}
			sql = `SELECT codPREP, A.codA0KM codA, fechaemision fecEm, 
            fechaentrega fecEnt, monto, marca, modelo, matricula, 
            nom, ape, Per.tipodoc tdoc, Per.nrodoc ndoc 
            FROM presupuestoreparacion P, docauto0km DA, auto0km A, 
            docfabricacion DF, ordendecompra O, cliente C, persona Per
            WHERE codPREP=(select MAX(codPREP) from presupuestoreparacion) 
            AND P.codA0KM=A.codA0KM AND DA.codDA0KM=A.codDA0KM 
            AND DA.codDF=DF.codDF AND DF.codODC=O.codODC AND O.codCL=C.codCL 
            AND C.codPER=Per.codPER AND A.codA0KM=${codA}`;
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
				codPREP,
				codA,
			};
			res.render("./posventa/c4/printPres", { data });
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
