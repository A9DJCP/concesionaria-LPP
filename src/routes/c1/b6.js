import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c1/b6/procPlanDePago", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var codR = parseInt(req.body.codR);
		if (codR <= 0) {
			res.render("./compras/c1/index", { msg: "Número de Recibo Inválido" });
		}
		//Si llega hasta aca es porque no entro al if, entonces el numero de recibo es valido inicialmente.
		sql = `SELECT COUNT(*) cont, descripcion FROM recibo R, ordendecompra O, formapago FP, docauto0km DA, auto0km A, 
		docfabricacion DF WHERE O.codODC=R.codODC AND FP.codFP=O.codFP AND estado='PAGADO' AND vigente=1 
		AND DA.codDF=DF.codDF AND DF.codODC=O.codODC AND DA.codDA0KM=A.codDA0KM AND codrec=${codR}`;
		rs = await pool.query(sql);
		var formaPago = rs[0].descripcion;
		if (rs[0].cont === 0) {
			res.render("./compras/c1/index", {
				msg: "El número de recibo es inválido, no ha sido pagado o corresponde a un automóvil que aún no ha sido registrado.",
			});
		}

		if (formaPago === "Efectivo") {
			//Forma de Pago Efectivo
			sql = `SELECT COUNT(*) cont FROM factura F, recibo R, ordendecompra O 
			WHERE O.codODC=R.codODC AND O.codODC=F.codODC AND codREC=${codR}`;
			rs = await pool.query(sql);
			if (rs[0].cont === 1) {
				sql = `SELECT COUNT(*) cont FROM recibo R, ordendecompra O, retiroauto0km RA 
				WHERE RA.codODC=O.codODC AND O.codODC=R.codODC AND retirado=1 AND codREC=${codR}`;
				rs = await pool.query(sql);
				if (rs[0].cont === 1) {
					msg =
						"Ya se ha registrado la factura para este recibo anteriormente y el automovil ya ha sido retirado.";
					res.render("./compras/c1/index", { msg });
				} else {
					//Se renueva la orden de retiro y se vuelve a registrar e imprimir.
					msg =
						"Ya se ha registrado la factura para este recibo anteriormente. Se ha renovado la orden de retira (la impresa anteriormente queda invalidada).";
					sql = `SELECT codODC FROM recibo R WHERE codrec = ${codR}`;
					rs = await pool.query(sql);
					var codODC = rs[0].codODC;
					sql = `UPDATE retiroauto0km set retirado=NULL WHERE cododc=${codODC}`;
					await pool.query(sql);
					sql = `INSERT INTO retiroauto0km values('',${codODC},curdate(),DATE_ADD(curdate(), INTERVAL 2 DAY),0)`;
					await pool.query(sql);
					sql = `SELECT codRA0KM, marca, modelo, matricula, nom, ape, P.tipodoc tdoc, P.nrodoc ndoc, R.fechaemision femis, R.fvto fvto, 
					descripcion, O.codODC codODC FROM retiroauto0km R, ordendecompra O, docfabricacion DF, cliente C, persona P, docauto0km DA, 
					formaPago FP WHERE R.codODC=O.codODC AND O.codODC=DF.codODC AND C.codCL=O.codCL AND C.codper=P.codper 
					AND DA.codDF=DF.codDF AND codRA0KM=(select MAX(codRA0km) FROM retiroauto0km) AND FP.codFP=O.codFP`;
					rs = await pool.query(sql);
					var data = {
						lblAuto:
							rs[0].marca +
							" " +
							rs[0].modelo +
							" // Matricula: " +
							rs[0].matricula,
						lblCliente:
							rs[0].nom +
							" " +
							rs[0].ape +
							" // " +
							rs[0].tdoc +
							": " +
							rs[0].ndoc,
						lblFemision: rs[0].femis,
						lblFvto: rs[0].fvto,
						lblNroOrden: rs[0].codRA0KM,
						lblNroODC: rs[0].codODC,
						lblMotivo: rs[0].descripcion + " (Renovación de Orden de retiro)",
					};
					res.render("./compras/c1/generarRetiro", { msg, data });
				}
			} else {
				//En caso de que la factura no esté registrada, se registra e imprime.
				sql = `SELECT O.cododc codODC, R.total monto FROM recibo R, ordendecompra O 
				WHERE O.codODC=R.codODC AND codREC=${codR}`;
				rs = await pool.query(sql);
				var codODC = rs[0].codODC;
				var monto = rs[0].monto;
				//Se registra como pagada porque se supone que el cliente la paga al momento de imprimirla.
				sql = `INSERT INTO factura values('',${codODC},${monto},curdate(),'Pagada')`;
				await pool.query(sql);
				sql = `SELECT year(curdate()) year,  marca, modelo, color, nom, ape, tipodoc tdoc, nrodoc ndoc,
				day(curdate()) day, direc, F.total ftot, R.Total rtot, porcentaje porc, month(curdate()) month,
				codF, O.codODC codODC, R.codREC nroRec 
				FROM Factura F, recibo R, ordendecompra O, persona Per, cliente C, autodisponible0km A,
				porcentaje P WHERE A.codAD0KM=O.codAD0KM AND Per.codPer=C.codper AND C.codCL=O.codCL AND R.codODC=O.codODC AND F.codODC=O.codODC
				AND P.descripcion='IVA' AND codF= (select MAX(codF) FROM factura) AND codREC=${codR}`;
				rs = await pool.query(sql);
				var lblYear = rs[0].year;
				var lblAuto = rs[0].marca + " " + rs[0].modelo + " " + rs[0].color;
				var lblCantidad = 1;
				var lblCliente =
					rs[0].nom + " " + rs[0].ape + " // " + rs[0].tdoc + ": " + rs[0].ndoc;
				var lblDay = rs[0].day;
				var lblDirec = rs[0].direc;
				var lblImporteFactura = rs[0].ftot;
				//El importe con iva representa el 21 porciento extra aplicado al costo total del automovil (recibo+factura).'
				var lblImporteIVA = (rs[0].ftot + rs[0].rtot) * (rs[0].porc / 100 + 1);
				//El importe TOTAL representa el 21 porciento del costo total del automóvil, menos la parte ya paga que es el recibo.'
				var lblTOT = lblImporteIVA - rs[0].rtot;
				var lblImporteRecibo = rs[0].rtot;
				var lblIVA = rs[0].porc;
				var lblMes = rs[0].month;
				var lblNroFactura = rs[0].codF;
				var lblCodODC = rs[0].codODC;
				var lblNroRecibo = rs[0].nroRec;
				var lblImporteTotal = rs[0].ftot + rs[0].rtot;
				sql = `INSERT INTO retiroauto0km values('',${lblCodODC},curdate(),DATE_ADD(curdate(), INTERVAL 2 DAY),0)`;
				await pool.query(sql);
				var data = {
					lblYear,
					lblAuto,
					lblCantidad,
					lblCliente,
					lblDay,
					lblDirec,
					lblImporteFactura,
					lblImporteIVA,
					lblTOT,
					lblImporteRecibo,
					lblIVA,
					lblMes,
					lblNroFactura,
					lblCodODC,
					lblNroRecibo,
					lblImporteTotal,
				};
				console.log(data);
				res.render("./compras/c1/generarFactura", { msg, data });
			}
		} else {
			//Forma de Pago Credito Prendario
			sql = `select codODC from recibo where codREC = ${codR}`;
			rs = await pool.query(sql);
			var codODC = rs[0].codODC;

			sql = `select COUNT(*) cont FROM prestamo P, ordendecompra O, recibo R 
			WHERE P.codODC=O.codODC AND O.codODC=R.codODC AND codREC=${codR}`;
			rs = await pool.query(sql);
			if (rs[0].cont >= 1) {
				msg =
					"El recibo ingresado ya tiene un prestamo en proceso. Se creara o renovara la orden de retiro.";
				sql = `select COUNT(*) cont from retiroauto0km where codODC = ${codODC} and retirado=1;`;
				rs = await pool.query(sql);
				if (rs[0].cont === 0) {
					sql = `UPDATE retiroauto0km SET retirado=NULL WHERE cododc=${codODC}`;
					await pool.query(sql);
					sql = `INSERT INTO retiroauto0km values('',${codODC},curdate(),DATE_ADD(curdate(), INTERVAL 2 DAY),0)`;
					await pool.query(sql);

					sql = `SELECT codRA0KM, marca, modelo, matricula, nom, ape, P.tipodoc tdoc, P.nrodoc ndoc, R.fechaemision femis, R.fvto fvto,
						descripcion	FROM retiroauto0km R, ordendecompra O, docfabricacion DF, cliente C, persona P, docauto0km DA, formaPago FP
						WHERE R.codODC=O.codODC AND O.codODC=DF.codODC AND C.codCL=O.codCL AND C.codper=P.codper AND DA.codDF=DF.codDF 
						AND codRA0KM=(select MAX(codRA0km) FROM retiroauto0km) AND FP.codFP=O.codFP`;
					rs = await pool.query(sql);

					var lblAuto =
						rs[0].marca +
						" " +
						rs[0].modelo +
						" // Matrícula: " +
						rs[0].matricula;
					var lblCliente =
						rs[0].nom +
						" " +
						rs[0].ape +
						" // " +
						rs[0].tdoc +
						": " +
						rs[0].ndoc;
					var lblFemision = rs[0].femis;
					var lblFvto = rs[0].fvto;
					var lblNroOrden = rs[0].codRA0KM;
					var lblMotivo =
						rs[0].descripcion + " (Renovación de Órden de Retiro)";
					var data = {
						lblNroODC: codODC,
						lblAuto,
						lblCliente,
						lblFemision,
						lblFvto,
						lblNroOrden,
						lblMotivo,
					};
					res.render("./compras/c1/generarRetiro", { msg, data });
				} else {
					msg = "El automóvil ya ha sido retirado.";
					res.render("./compras/c1/index", { msg });
				}
			} else {
				res.render("./compras/c1/generarPrestamo", { msg, codR });
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/index", { msg: err });
	}
});

router.post("/c1/b6/regPrestamo", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var cant = parseInt(req.body.cant);
		var codR = parseInt(req.body.codR);
		if (cant > 20 || cant < 3) {
			msg = "La cantidad de cuotas no puede ser mayor a 20 ni menor a 3.";
			res.render("./compras/c1/generarPrestamo", { msg });
		} else {
			sql = `select codODC from recibo where codREC=${codR}`;
			rs = await pool.query(sql);
			var codODC = rs[0].codODC;

			console.log("HOLA LLEGUE ACA");
			sql = `SELECT total from recibo where codREC = ${codR}`;
			rs = await pool.query(sql);
			var precio = parseInt(rs[0].total) / cant;

			sql = `insert into prestamo values ('',${codODC},${cant},${precio},DATE_ADD(Curdate(),INTERVAL 1 MONTH),0,0)`;
			await pool.query(sql);
			console.log("HOLA LLEGUE ACA 2");
			sql = "select MAX(codPRE) codPRE from prestamo";
			rs = await pool.query(sql);
			var codPRE = rs[0].codPRE;
			console.log("HOLA LLEGUE ACA 3");
			sql = `select DATE_ADD(curdate(), INTERVAL 1 MONTH) fecha`;
			rs = await pool.query(sql);
			var fechaInicial = rs[0].fecha;
			for (var i = 0; i < cant; i++) {
				sql = `insert into cuota values('',${codPRE},${i},0,(select DATE_ADD(Curdate(),INTERVAL ${i} MONTH)), (select DATE_ADD(Curdate(),INTERVAL (${i} + 1) MONTH)))`;
				await pool.query(sql);
			}
			msg = "Préstamo registrado correctamente.";
			sql = `insert into retiroauto0km values('',${codODC},curdate(),(DATE_ADD(Curdate(),INTERVAL 2 DAY)),FALSE)`;
			await pool.query(sql);
			99;
			sql = `SELECT codRA0KM, marca, modelo, matricula, nom, ape, P.tipodoc tdoc, P.nrodoc ndoc, 
			R.fechaemision femision, R.fvto fvto 
			FROM retiroauto0km R, ordendecompra O, docfabricacion DF, cliente C, persona P, docauto0km DA 
			WHERE R.codODC=O.codODC AND O.codODC=DF.codODC AND C.codCL=O.codCL AND C.codper=P.codper AND DA.codDF=DF.codDF 
			AND codRA0KM=(SELECT MAX(codRA0km) FROM retiroauto0km)`;
			rs = await pool.query(sql);
			var lblCliente =
				rs[0].nom + " " + rs[0].ape + " // " + rs[0].tdoc + " : " + rs[0].ndoc;

			var data = {
				lblCliente,
				lblNroOrdenCompra: codODC,
				lblFechaInicial: fechaInicial,
				lblCant: cant,
				lblPrec: precio,
				lblCodPRE: codPRE,
			};

			res.render("./compras/c1/printDocPres", { msg, data });
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/index", { msg: err });
	}
});

export default router;