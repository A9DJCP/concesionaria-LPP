import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c8/b1", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	sql = `select COUNT(*) cont 
    FROM Persona P, propietario PR, autousado A, contrato C 
    WHERE P.codPer = PR.codPer AND PR.codP = A.codP AND C.codAU=A.codAU 
    AND A.borrado = 0 AND sinvigencia=0 AND estado="Abierto" and fvto <= curdate()`;
	rs = await pool.query(sql);
	if ((await pool.query(sql))[0].cont === 0) {
		res.render("./contratos/c8", {
			msg: "No hay ningún contrato vencido sin actualizar.",
		});
	} else {
		sql = `SELECT dayname(curdate()) dia`;
		rs = await pool.query(sql);
		//Esta linea siguiente se borra
		var esAdmin = true;
		if (esAdmin || rs[0].dia === "Friday") {
			//Se actualiza la tabla de autosusados para poder hacer todos los informes.
			//Por este motivo es que no se puede volver una vez que se ingresa hasta terminar todos los informes.
			sql = `select P.codPer per, A.codAU codAU, codC, nom, ape, matricula, marca, modelo, fvto, PR.codP prop 
            FROM Persona P, propietario PR, autousado A, contrato C 
            WHERE P.codPer = PR.codPer AND PR.codP = A.codP AND C.codAU=A.codAU 
            AND A.borrado = 0 AND estado="Abierto" AND sinvigencia=0 AND C.fvto < curdate()`;
			rs = await pool.query(sql);
			var autos = [];
			rs.forEach((a) =>
				autos.push({
					per: a.per,
					auto: a.codAU,
					prop: a.prop,
					contrato: a.codC,
					matricula: a.matricula,
					marca: a.marca,
					modelo: a.modelo,
					fvto: `${new Date(a.fvto).getDate()}/${
						new Date(a.fvto).getMonth() + 1
					}/${new Date(a.fvto).getFullYear()}`,
				})
			);

			sql = `update autousado A, Contrato C set sinvigencia=1, estado="Cerrado sin exito"
            where A.codAU IN (select codAU from Contrato where fvto <= curdate()) AND C.codAU=A.codAU`;
			await pool.query(sql);
			res.render("./contratos/c8/muestraAutos", { autos });
		} else {
			msg =
				"Lo sentimos, este proceso sólo se puede ejecutar al final de semana (Día Viernes)";
			res.render("./contratos/c8/index", { msg });
		}
	}
});

export default router;
