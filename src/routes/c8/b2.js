import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c8/b2", isLoggedIn, async (req, res) => {
	var msg, sql, rs, codC;
	try {
		codC = req.body.codC;
		sql = `select COUNT(*) cont from contrato where estado='Cerrado sin éxito' and codC=${codC}`;
		if ((await pool.query(sql))[0].cont === 0) {
			msg =
				"El número de contrato ingresado es inválido o no corresponde a un automóvil sin vender y sin vigencia.";
			res.render("./contratos/c8", { msg });
		} else {
			sql = `select COUNT(*) cont from retiro where codC=${codC}`;
			if ((await pool.query(sql))[0].cont === 1) {
				msg = "La órden de retiro del automóvil ya se ha impreso.";
				res.render("./contratos/c8", { msg });
			} else {
				//El cliente 1 no es un cliente real, se usa el codCL = 1 en el insert porque no hay un cliente que retire el
				// auto sino un propietario, que se recupera a traves del codC.
				sql = `insert into retiro values ('',${codC},1,'Sin Vigencia','Pendiente',date_add(curdate(), INTERVAL 2 DAY), curdate())`;
				await pool.query(sql);
				sql = `select codR, nom, ape, tipodoc, nrodoc, marca, modelo, color, matricula, curdate() fecha, R.fvto fvto
				FROM Retiro R, contrato C, autousado A, propietario P, persona Per
				WHERE R.codC=C.codC AND A.codAU=C.codAU AND P.codP=A.codP AND P.codPer=Per.CodPer 
				AND codR=(select max(codR) from retiro)`;
				rs = await pool.query(sql);
				var data = {
					codR: rs[0].codR,
					prop: rs[0].nom + " " + rs[0].ape,
					doc: rs[0].tipodoc + ": " + rs[0].nrodoc,
					auto: rs[0].marca + " " + rs[0].modelo + " " + rs[0].color,
					mat: rs[0].matricula,
					fecha: rs[0].fecha,
					fvto: rs[0].fvto,
					codC,
				};
				res.render("./contratos/c8/printRetiro", { data });
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./contratos/c8", { msg: err });
	}
});

export default router;
