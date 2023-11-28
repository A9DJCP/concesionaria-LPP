import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";
router.post("/c6/b5", isLoggedIn, async (req, res) => {
	var sql, rs, msg, data;
	try {
		var codR = req.body.codR;
		sql = `select COUNT(*) cont from retiro where codR=${codR} and estado='Pendiente'`;
		if ((await pool.query(sql))[0].cont === 0) {
			msg =
				"El número de retiro ingresado es inválido o el automóvil ya se ha retirado.";
			res.render("./compras/c6/index", { msg });
		} else {
			sql = `UPDATE retiro set estado='Retirado' where codR=${codR}`;
			await pool.query(sql);
			sql = `SELECT CON.codC codC, nom, ape, tipodoc, nrodoc, C.codCL codCL, porcGanLPP, F.total total
            FROM Retiro R, cliente C, persona P, contrato CON, facturacompraautousado F, presupuestoautousado PR
            WHERE R.codC=CON.codC AND R.codCL=C.codCL AND C.codper=P.codper AND F.codPAUS=PR.codPAUS 
            AND PR.codCL=C.codCL and PR.codC=CON.codC and codR=${codR}`;
			rs = await pool.query(sql);
			var contrato = rs[0].codC;
			var total = rs[0].total;
			var ganancia = rs[0].porcGanLPP;
			data = {
				contrato,
				cliente: rs[0].nom + " " + rs[0].ape,
				documento: rs[0].tipodoc + " " + rs[0].nrodoc,
				codCL: rs[0].codCL,
				ganancia,
				total,
			};
			sql = `INSERT into ordenpago VALUES ('',${contrato},${
				total * (1 - ganancia / 100)
			},
            DATE_ADD(curdate(), INTERVAL 1 YEAR),NULL,'Pendiente')`;
			await pool.query(sql);
			sql = `select codORPAG, curdate() fecha, fvto from ordenpago where codORPAG=(select max(codORPAG) from ordenpago)`;
			rs = await pool.query(sql);
			data = {
				...data,
				codORPAG: rs[0].codORPAG,
				femision: rs[0].fecha,
				fvto: rs[0].fvto,
			};
			res.render("./compras/c6/ordenDePago", { data });
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c6/index", { msg: err });
	}
});
export default router;
