import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c6/b2", isLoggedIn, async (req, res) => {
	var msg, sql, rs, data;
	try {
		var nroPres = req.body.nroPres;
		sql = `select COUNT(*) cont from presupuestoautousado where estado='Pendiente' and codPAUS=${nroPres}`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg =
				"El número de presupuesto ingresado es inválido o no corresponde a un presupuesto pendiente.";
			res.render("./compras/c6", { msg });
		} else {
			sql = `UPDATE presupuestoautousado set estado='Aceptado' where codPAUS=${nroPres}`;
			await pool.query(sql);
			sql = `select monto, porcentaje from presupuestoautousado, porcentaje where codPAUS=${nroPres} AND descripcion='IVA';`;
			rs = await pool.query(sql);
			var IVA = rs[0].porcentaje;
			var submonto = rs[0].monto;
			var montoFinal = submonto * (1 + IVA / 100);
			sql = `INSERT into facturacompraautousado(codFCAU, codPAUS, total, estado, fechapago) 
                VALUES ('',${nroPres},${montoFinal},'Pendiente',curdate())`;
			await pool.query(sql);
			sql = `select max(codFCAU) codFCAU from facturacompraautousado where codPAUS=${nroPres}`;
			var codFCAU = (await pool.query(sql))[0].codFCAU;

			sql = `select curdate() fecha, nom, ape, tipodoc, nrodoc, tel, mail, direc 
                FROM persona P, cliente C, presupuestoautousado PR 
                WHERE PR.codCL=C.codCL AND C.codPer=P.codPer AND codPAUS=${nroPres}`;
			rs = await pool.query(sql);
			data = {
				codFCAU,
				nroPres,
				fecha: rs[0].fecha,
				nom: rs[0].nom,
				ape: rs[0].ape,
				tdoc: rs[0].tipodoc,
				ndoc: rs[0].nrodoc,
				tel: rs[0].tel,
				mail: rs[0].mail,
				direc: rs[0].direc,
			};
			sql = `select marca, modelo, color from presupuestoautousado P, contrato C, autousado A 
                WHERE P.codC=C.codC and C.codAU=A.codAU and codPAUS=${nroPres}`;
			rs = await pool.query(sql);
			data = {
				...data,
				auto: rs[0].marca + " " + rs[0].modelo + " " + rs[0].color,
				IVA,
				subTotal: submonto,
				total: montoFinal,
			};
			res.render("./compras/c6/facturaAU", { data });
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c6", { msg: err });
	}
});

export default router;
