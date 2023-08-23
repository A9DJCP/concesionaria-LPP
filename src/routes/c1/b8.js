import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c1/b8/confSeguro", isLoggedIn, async (req, res) => {
	var sql, msg, rs;
	try {
		var codF = req.body.codF;
		sql = `select COUNT(*) cont, A.codA0KM codA FROM docauto0km DA, auto0km A where DA.codDA0KM=A.codDA0KM 
        AND codigodefabrica='${codF}'`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg = "Codigo Invalido o Inexistente";
			res.render("./compras/c1/index", { msg });
		} else {
			var codA = rs[0].codA;
			sql = `SELECT COUNT(*) cont FROM seguro0km S, docauto0km DA, auto0km A 
            WHERE S.codA0KM=A.codA0KM AND A.codDA0KM=DA.codDA0KM AND codigodefabrica='${codF}' 
            AND estado='Vigente'`;
			rs = await pool.query(sql);
			if (rs[0].cont === 0) {
				sql = `SELECT TS.codTS codTS, descripcion, nombre, explicacion 
                FROM condicion C, condiciontiposeguro CTS, tiposeguro TS 
                WHERE CTS.codTS=TS.codTS AND CTS.codCOND=C.codCOND AND TS.nombre='Seguro Ante Todo Riesgo'`;
				rs = await pool.query(sql);
				var codts = rs[0].codTS;
				var desc = rs[0].descripcion;
				var nom = rs[0].nombre;
				var exp = rs[0].explicacion;
				console.log("HOLA LLEGUE HASTA ACA");
				sql = `SELECT SUM(monto) acum FROM presupuestoaccesorio PA, auto0KM A, docauto0KM DA 
                WHERE DA.codDA0KM=A.codDA0KM AND A.codA0KM=PA.codA0KM AND codigodefabrica='${codF}' 
                GROUP BY A.codA0KM`;
				rs = await pool.query(sql);
				var acum;
				if (rs.length === 0) {
					acum = 0;
				} else {
					acum = rs[0].acum;
				}

				sql = `SELECT precio from autodisponible0km A, ordendecompra O, docfabricacion DF, docauto0km DA 
                WHERE A.codAD0KM=O.codAD0KM AND O.codODC=DF.codODC AND DF.codDF=DA.codDF 
                AND codigodefabrica='${codF}'`;
				rs = await pool.query(sql);
				acum = acum + rs[0].precio;

				sql = `INSERT into seguro0km values 
                ('', ${codts},${codA},curdate(),DATE_ADD(curdate(), INTERVAL 2 YEAR),${acum},'Vigente')`;
				await pool.query(sql);

				sql = `SELECT MAX(codS0KM) codS from seguro0km`;
				rs = await pool.query(sql);
				var codS = rs[0].codS;
				sql = `SELECT 
                max(S.codS0KM) codS, P.nom nom, P.ape ape, P.tipodoc tdoc, P.nrodoc ndoc, DA.motor motor, 
                DA.chasis chasis, DA.codigodefabrica codF, DA.aniofabricacion yearF, DA.modelo modelo, 
                DA.marca marca, DA.matricula matricula, S.valorasegurado valorasegurado, S.femision femision, 
                S.fecfin fecfin, curdate() fecha, TS.nombre tsnom, TS.explicacion tsexp
                FROM Persona P, cliente C, ordendecompra O, docfabricacion DF, docauto0km DA, auto0km A, 
                Seguro0KM S, tiposeguro TS, condiciontiposeguro CTS, condicion Co
                WHERE P.codPER=c.codper AND C.codCL=O.codCL AND O.codODC=DF.codODC AND DF.codDF=DA.codDF 
                AND DA.codDA0KM=A.codDA0KM AND A.codA0KM=S.codA0KM AND S.codTS=TS.codTS 
                AND TS.codTS=CTS.codTS AND Co.codcond=CTS.codcond AND codS0KM=${codS}`;
				rs = await pool.query(sql);
				var data = {
					codS: rs[0].codS,
					titular: rs[0].nom + " " + rs[0].ape,
					doctitular: rs[0].tdoc + " : " + rs[0].ndoc,
					motor: rs[0].motor,
					chasis: rs[0].chasis,
					codF: rs[0].codF,
					yearF: rs[0].yearF,
					modelo: rs[0].modelo,
					marca: rs[0].marca,
					matricula: rs[0].matricula,
					valorasegurado: rs[0].valorasegurado,
					femision: rs[0].femision,
					fecfin: rs[0].fecfin,
					fecha: rs[0].fecha,
					tsnom: rs[0].tsnom,
					tsexp: rs[0].tsexp,
				};
				res.render("./compras/c1/printSeguro", { data });
			} else {
				msg =
					"El automóvil cuyo código de fábrica fue ingresado ya tiene un seguro registrado vigente.";
				res.render("./compras/c1/index", { msg });
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c1/index", { msg: err });
	}
});

export default router;
