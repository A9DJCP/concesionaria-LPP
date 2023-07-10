import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c4/b4", isLoggedIn, async (req, res) => {
	var msg, sql, rs, codPREP;
	try {
		codPREP = req.body.codPREP;
		sql = `select COUNT(*) FROM presupuestoreparacion 
        WHERE codPREP=${codPREP} AND estado='Aceptado'`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg =
				"El número de presupuesto ingresado es inválido o no corresponde a un presupuesto aceptado no pago.";
			res.render("./posventa/c4/index", { msg });
		} else {
			sql = `UPDATE presupuestoreparacion SET estado='Pago' 
            WHERE codPREP=${codPREP}`;
			await pool.query(sql);
			sql = `select porcentaje from porcentaje where descripcion='IVA'`;
			rs = await pool.query(sql);
			const iva = rs[0].porcentaje;
			sql = `select monto from presupuestoreparacion where codPREP=${codPREP}`;
			rs = await pool.query(sql);
			//El submonto es el monto sin aplicar el IVA
			var submonto = rs[0].monto;
			var montototal = submonto + submonto * (iva / 100);
			sql = `INSERT into FacturaReparacion VALUES ('',${codPREP},curdate(),${montototal})`;
			await pool.query(sql);
			sql = `select MAX(codFREP) codFREP from facturareparacion`;
			rs = await pool.query(sql);
			var codFREP = await rs[0].codFREP;
			console.log(codFREP);
			console.log(parseInt(codFREP));

			sql = `SELECT day(f.fechaemision) dia,
            month(f.fechaemision) mes, year(F.fechaemision) year, 
            nom, ape, tipodoc tdoc, nrodoc ndoc, direc
            FROM Facturareparacion F, presupuestoreparacion PR, auto0KM A, cliente C, 
            Persona Per WHERE codFREP=(SELECT MAX(codFREP) FROM facturareparacion) 
            AND F.codPREP=Pr.codPREP AND PR.codA0KM=A.codA0KM
            AND A.codCL=C.codCL AND C.codPer=Per.CodPER`;
			rs = await pool.query(sql);
			var data = {
				nom: rs[0].nom,
				ape: rs[0].ape,
				tipodoc: rs[0].tdoc,
				nrodoc: rs[0].ndoc,
				direc: rs[0].direc,
				dia: rs[0].dia,
				mes: rs[0].mes,
				year: rs[0].year,
				iva,
				submonto,
				montototal,
				codPREP,
				codFREP,
			};

			sql = `SELECT nombre, D.PU pu FROM detallepresupuestoreparacion D, 
            reparaciondisponible R, facturareparacion F, presupuestoreparacion P
            WHERE R.codRDISP=D.codRDISP AND F.codPREP=P.codPREP AND P.codPREP=D.codPREP 
            AND F.codFREP=${codFREP}`;
			rs = await pool.query(sql);
			//Vamos a guardar la info de cada reparacion y se lo pasamos al front
			var reparaciones = [];
			rs.forEach((r) => reparaciones.push({ nombre: r.nombre, PU: r.pu }));
			console.log(data);
			res.render("./posventa/c4/printFactRep", { data, reparaciones });
		}
	} catch (err) {
		console.log(err);
		msg = "Ocurrio un error inesperado";
		if (typeof codPREP !== "undefined") {
			sql = `UPDATE presupuestoreparacion set estado='Aceptado' where codPREP=${codPREP}`;
			await pool.query(sql);
		}
		res.render("./posventa/c4/index", { msg });
	}
});

export default router;
