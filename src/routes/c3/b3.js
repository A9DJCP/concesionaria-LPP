import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/imprimirFacturaAccesorio", async (req, res) => {
	try {
		var codPAA = req.body.codPAA;
		var sql = `select COUNT(*) cont FROM presupuestoaccesorio
        WHERE codPAA=${codPAA} AND estado='Aceptado'`;
		var rs = await pool.query(sql);
		if (result[0].cont === 0) {
			req.flash(
				"El número del presupuesto es inválido, inexistente o no corresponde a un presupuesto aceptado."
			);
		} else {
			sql = `UPDATE presupuestoaccesorio set estado='Pago' where codPAA=${codPAA}`;
			await pool.query(sql);
			sql = "select porcentaje from porcentaje where descripcion='IVA'";
			rs = await pool.query(sql);
			const iva = rs[0].porcentaje;
			sql = `select monto, sum(cant) suma from presupuestoaccesorio P, detallepresupuestoaccesorio DPA 
                WHERE DPA.codPAA=P.codPAA and P.codPAA=${codPAA} group by P.codPAA"`;
			rs = await pool.query(sql);
			var submonto = rs[0].monto;
			var montototal = submonto + submonto * (iva / 100);
			sql = `INSERT into facturaaccesorio VALUES ('',${codPAA},curdate(),${montototal})"`;
			await pool.query(sql);
			sql = `select nom, ape, P.tipodoc tipodoc, nrodoc, direc 
                FROM Persona P, cliente C, ordendecompra O, docfabricacion DF, 
                docauto0km DA, auto0km A, presupuestoaccesorio PA
                WHERE P.codPER=C.codPEr AND O.codCL=C.codcl AND O.codODC=DF.codODC AND DF.codDF=DA.codDF 
                AND DA.codDA0KM=A.codDA0KM AND A.codA0KM=PA.codA0KM AND PA.codPAA=${codPAA}`;
			rs = await pool.query(sql);
			var data = {
				nom: rs[0].nom,
				ape: rs[0].ape,
				tipodoc: rs[0].tipodoc,
				nrodoc: rs[0].nrodoc,
				direc: rs[0].direc,
			};

			sql = `SELECT P.codPAA codPAA, codFACC,Day(curdate()) dia, Month(curdate()) mes, Year(curdate()) year 
                FROM presupuestoaccesorio P, facturaaccesorio F WHERE P.codPAA=F.codPAA and P.codPAA=${codPAA}
                AND codFACC=(select MAX(codFACC) from facturaaccesorio)
                `;
			rs = await pool.query(sql);
			data = {
				...data,
				codPAA: rs[0].codPAA,
				codFACC: rs[0].codFACC,
				dia: rs[0].dia,
				mes: rs[0].mes,
				year: rs[0].year,
			};

			sql = `SELECT nombre, D.PU, D.cant 
                FROM detallepresupuestoaccesorio D, presupuestoaccesorio P, facturaaccesorio F, accesorio A 
                WHERE F.codPAA=P.codPAA AND D.codPAA=P.codPAA AND D.codACC=A.codACC 
                AND codFACC= (select MAX(codFACC) from facturaaccesorio)`;
			rs = await pool.query(sql);
			//Vamos a guardar la info de cada accesorio y se lo pasamos al front
			var count = 0,
				seguir = true;
			var array = [];
			rs.forEach((v) => array.push(v.accesorio));
			data = { ...data, array };
			res.render("./posventa/c3/imprimirPresupuesto", { data });
		}
	} catch (err) {
		console.log(err);
		req.flash("Ocurrio un error inesperado");
	}
	res.render("./posventa/c3/index");
});

router.get("/c3/b3/index", (req, res) => {
	res.render("./posventa/c3/imprimirPresupuesto");
});

export default router;
