import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c1/b2/acptODC", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		var codODC = parseInt(req.body.cododc);
		//Vigente = 0 significa que todavia no se ha aceptado la orden de compra. El 1 significa que si.
		sql = `select count(*) cont from ordendecompra where cododc=${codODC} AND vigente=0`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			res.render("./compras/c1/index", {
				msg: "Número de Órden de Compra Inválido, inexistente o correspondiente a una órden de compra cuyo recibo ya ha sido procesado.",
			});
		} else {
			sql = `SELECT nom, ape, tipodoc, nrodoc, marca, modelo, precio, color, curdate() fecha
                FROM ordendecompra O, AutoDisponible0km AD, Cliente C, formapago F, persona P
                WHERE AD.codad0km=O.codad0km AND O.codCL=C.codCL AND O.codFP=F.codFP AND C.codPer=P.codPer 
                AND cododc=${codODC}`;
			rs = await pool.query(sql);
			var data = {
				codODC,
				nom: rs[0].nom,
				ape: rs[0].ape,
				tdoc: rs[0].tipodoc,
				ndoc: rs[0].nrodoc,
				marca: rs[0].marca,
				modelo: rs[0].modelo,
				precio: rs[0].precio,
				importe: rs[0].precio / 2,
				color: rs[0].color,
				fecha: rs[0].fecha,
			};
			var precio2 = rs[0].precio / 2;
			sql = `UPDATE recibo set estado='OBSOLETO' where codODC=${codODC}`;
			await pool.query(sql);
			sql = `INSERT into recibo values ('',${precio2},${codODC},curdate(),'VIGENTE')`;
			await pool.query(sql);
			sql = `UPDATE ordendecompra set vigente=1 where cododc=${codODC}`;
			await pool.query(sql);
			sql =
				"SELECT max(codREC) nroRecibo, day(curdate()) dia, monthname(curdate()) mes, year(curdate()) year from recibo";
			rs = await pool.query(sql);
			data = {
				...data,
				nroRecibo: rs[0].nroRecibo,
				dia: rs[0].dia,
				mes: rs[0].mes,
				year: rs[0].year,
			};
			console.log(data.nroRecibo);
			res.render("./compras/c1/generarRecibo", { data });
		}
	} catch (err) {
		console.log(err);
		//res.render("./compras/c1/index", { msg: err });
		res.json({ msg: err.message });
	}
});

export default router;
