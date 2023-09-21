import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.post("/c6/b4", isLoggedIn, async (req, res) => {
	var sql, rs, msg, data;
	try {
		var nroF = req.body.nroF;
		sql = `select COUNT(*) cont from facturacompraautousado where estado='Paga' and codFCAU=${nroF}`;
		if ((await pool.query(sql))[0].cont === 0) {
			msg =
				"El número de factura ingresado es inválido o no corresponde a una factura paga.";
			res.render("./compras/c6", { msg });
			//Refresh
		} else {
			sql = `SELECT COUNT(*) cont FROM retiro R, contrato C, facturacompraautousado F, presupuestoautousado P 
            WHERE P.codC=C.codC AND R.codC=C.codC AND F.codPAUS=P.codPAUS AND R.estado='Retirado' AND codFCAU=${nroF}`;
			if ((await pool.query(sql))[0].cont === 1) {
				msg = "El automovil correspondiente ya ha sido retirado.";
				res.render("./compras/c6", { msg });
				//Refresh
			} else {
				sql = `select COUNT(*) cont FROM retiro R, contrato C WHERE C.codC=R.codC 
                AND C.codC=(select codC from facturacompraautousado F, presupuestoautousado P 
                    where P.codPAUS=F.codPAUS and codFCAU=${nroF})`;
				if ((await pool.query(sql))[0].cont > 0) {
					//Reimpresion de orden de retiro --> Dar de baja anterior.
					sql = `SELECT codR from Retiro R, facturacompraautousado F, presupuestoautousado P, contrato C 
                    WHERE C.codC=P.codC AND R.codC=C.codC AND P.codPAUS=F.codPAUS AND F.codFCAU=${nroF}`;
					await pool.query(
						`UPDATE retiro set estado='Obsoleto' where codR=${
							(
								await pool.query(sql)
							)[0].codR
						}`
					);
				}
				//Genero la impresion de la orden de retiro
				sql = `SELECT codCL, codC FROM presupuestoautousado P, facturacompraautousado F 
                WHERE F.codPAUS=P.codPAUS and codFCAU=${nroF}`;
				rs = await pool.query(sql);
				var codCL = rs[0].codCL;
				var codC = rs[0].codC;
				await pool.query(
					`INSERT INTO retiro VALUES ('',${codC},${codCL},'Automovil comprado','Pendiente',DATE_ADD(curdate(), INTERVAL 2 DAY),curdate())`
				);
				sql = `select marca, modelo, color, matricula 
                FROM FacturaCompraAutoUsado F, presupuestoautousado P, contrato C, autousado A 
                WHERE F.codPAUS=P.codPAUS and P.codC=C.codC and C.codAU=A.codAU AND codFCAU=${nroF}`;
				rs = await pool.query(sql);
				var auto = rs[0].marca + " " + rs[0].modelo + " " + rs[0].color;
				var mat = rs[0].matricula;

				sql = `SELECT codR, nom, ape, tipodoc, nrodoc, motivoretiro, femision, fvto 
                FROM cliente C, persona P, retiro R WHERE codR=(select max(codR) from retiro) 
                AND R.codCL=C.codCL and P.codper=C.codPer`;
				rs = await pool.query(sql);
				data = {
					nroF,
					codCL,
					codC,
					cliente: rs[0].nom + " " + rs[0].ape,
					documento: rs[0].tipodoc + ": " + rs[0].nrodoc,
					codR: rs[0].codR,
					motivo: rs[0].motivoretiro,
					femision: rs[0].femision,
					fvto: rs[0].fvto,
					auto,
					mat,
				};
				console.log(data);
				res.render("./compras/c6/ordenRetiro", { data });
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c6/index", { msg: err });
	}
});

export default router;
