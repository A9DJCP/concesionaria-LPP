import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

router.get("/c6/b1", isLoggedIn, async (req, res) => {
	var sql, rs, msg;
	try {
		sql = `SELECT COUNT(*) cont FROM autousado where borrado=0`;
		rs = await pool.query(sql);
		if (rs[0].cont === 0) {
			msg =
				"Lo sentimos, en este momento no hay automóviles usados disponibles para su venta.";
			res.render("./compras/c6", { msg });
		} else {
			res.render("./compras/c6/ventaAutoUsado", { enable: false });
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c6", { msg: err });
	}
});

router.post("/c6/b1/verifCliente", isLoggedIn, async (req, res) => {
	var msg, sql, rs;
	try {
		var nom = req.body.nom;
		var ape = req.body.ape;
		var tdoc = req.body.tdoc;
		var ndoc = req.body.ndoc;
		if (nom == null || ape == null || tdoc == null || ndoc == null) {
			res.render("./compras/c6/ventaAutoUsado", {
				enable: false,
				msg: "Los datos ingresados son insuficientes para poder realizar la verificación.",
			});
		} else {
			sql = `SELECT count(*) cont from cliente C, persona P 
            WHERE P.codPer=C.codper AND tipodoc='${tdoc}' AND nrodoc='${ndoc}' 
            AND nom='${nom}' AND ape='${ape}' AND P.borrado=0 AND C.borrado=0`;
			rs = await pool.query(sql);
			if (rs[0].cont === 1) {
				//El cliente se ha verificado
				msg = "El cliente se ha verificado";
				var autos = await cargarAutos();
				console.log(autos);
				res.render("./compras/c6/interfazDeVenta", {
					autos,
					nom,
					ape,
					ndoc,
					tdoc,
				});
			} else {
				//El cliente no esta registrado como Cliente
				//Modificacion a la logica del sistema: Ya sea que el cliente este o no registrado como persona. Mientras no este registrado como cliente se pediran el resto de los datos y luego se verificara antes de hacer el insert si existe o no la persona ya
				res.render("./compras/c6/ventaAutoUsado", {
					enable: true,
					msg: "Ingrese los datos necesarios restantes para poder registrar al cliente.",
					nom,
					ape,
					tdoc,
					ndoc,
				});
			}
		}
	} catch (err) {
		console.log(err);
		res.render("./compras/c6/ventaAutoUsado", { enable: false, msg: err });
	}
});

router.post("/c6/b1/ingresarCliente", isLoggedIn, async (req, res) => {
	var sql, rs, nom, ape, tdoc, ndoc, direc, tel, mail, requisitos, cont;
	var codPer;
	try {
		nom = req.body.nom;
		ape = req.body.ape;
		tdoc = req.body.tdoc;
		ndoc = req.body.ndoc;
		direc = req.body.direc;
		tel = req.body.tel;
		mail = req.body.mail;
		if (req.body.grupo === "si") {
			requisitos = true;
		} else {
			requisitos = false;
		}
		console.log(req.body);
		var sql = `select COUNT(*) cont, codper FROM persona 
		WHERE borrado=0 AND tipodoc='${tdoc}' AND nrodoc='${ndoc}' 
		AND nom='${nom}' AND ape='${ape}'`;
		//Consulta para ver si el cliente existe como persona
		rs = await pool.query(sql);
		codPer = rs[0].codper;
		cont = rs[0].cont;
		if (cont == 0) {
			//El cliente no esta registrado como persona. Hay que registrarlo como persona.
			sql = `INSERT into persona values ('','${tdoc}','${ndoc}','${nom}',
			'${ape}','${direc}','${tel}','${mail}',0)`;
			await pool.query(sql);
			sql = `select codper FROM persona 
			WHERE codper=(select MAX(codper) from persona) and borrado=0`;
			rs = await pool.query(sql);
			codPer = rs[0].codper;
		}
		sql = `INSERT into cliente values ('',${codPer},${requisitos},0)`;
		await pool.query(sql);
		var autos = await cargarAutos();
		res.render("./compras/c6/interfazDeVenta", { autos, nom, ape, ndoc, tdoc });
	} catch (err) {
		console.log(err);
		res.render("./compras/c6", { msg: err });
	}
});
router.post("/c6/b1/generarPedido", isLoggedIn, async (req, res) => {
	var msg, sql, rs;
	var nom, ape, tdoc, ndoc, formaPago, contrato, precio;
	try {
		console.log(req.body);
		nom = req.body.nom;
		ape = req.body.ape;
		tdoc = req.body.tdoc;
		ndoc = req.body.ndoc;
		formaPago = req.body.seleccion;
		contrato = req.body.contrato;
		precio = req.body.precio;

		sql = `SELECT codPer FROM Persona WHERE tipodoc = '${tdoc}' 
		AND nrodoc = '${ndoc}' AND nom = '${nom}' AND ape ='${ape}'`;
		rs = await pool.query(sql);
		var codPer = rs[0].codPer;

		sql = `select codCL from cliente where codper=${codPer}`;
		rs = await pool.query(sql);
		var codCL = rs[0].codCL;
		sql = `INSERT into presupuestoautousado values('',${codCL}, ${contrato},curdate(),${precio},'Pendiente')`;
		await pool.query(sql);
		//Se hace el borrado lógico del auto ordenado para que no esté disponible a comprar por otra persona. Si se quiere cancelar esta compra una vez ya llegado a este punto se debe forzar desde el ABM'
		sql = `SELECT A.codAU codAU FROM autousado A, contrato C, presupuestoautousado P 
        WHERE P.codC=C.codC AND C.codAU=A.codAU AND codPAUS=(select max(codPAUS) from presupuestoautousado)`;
		rs = await pool.query(sql);
		var codAU = rs[0].codAU;
		sql = `UPDATE autousado set borrado=1 where codAU=${codAU}`;
		await pool.query(sql);
		//Datos del Cliente en el presupuesto
		sql = `SELECT codPAUS, nom, ape, tipodoc, nrodoc, tel, mail, direc, curdate() fecha FROM Cliente C, persona P, 
        presupuestoautousado PR WHERE PR.codcl=C.codCl AND C.codPer=P.codPer 
        AND codPAUS=(select MAX(codPAUS) from presupuestoautousado)`;
		rs = await pool.query(sql);
		var data = {
			codCL,
			codAU,
			nroPres: rs[0].codPAUS,
			nom: rs[0].nom,
			ape: rs[0].ape,
			tdoc: rs[0].tipodoc,
			ndoc: rs[0].nrodoc,
			tel: rs[0].tel,
			mail: rs[0].mail,
			direc: rs[0].direc,
			fecha: rs[0].fecha,
		};
		//Datos del automóvil
		sql = `SELECT marca, modelo, precioventa, color FROM autousado A, contrato C, presupuestoautousado P 
        WHERE C.codAU=A.codAU AND C.codC=P.codC AND codPAUS=(SELECT MAX(codPAUS) FROM presupuestoautousado)`;
		rs = await pool.query(sql);
		data = {
			...data,
			marca: rs[0].marca,
			modelo: rs[0].modelo,
			precio: rs[0].precioventa,
			color: rs[0].color,
		};
		//Datos del propietario actual
		sql = `SELECT nom, ape, tipodoc, nrodoc, tel, mail, direc, C.codC
        FROM Propietario P, persona Per, presupuestoautousado PR, contrato C, autousado A
        WHERE PR.codC=C.codC AND C.codAU=A.codAU AND A.codP=P.codP AND P.codPer=Per.codPer 
        AND codPAUS=(SELECT MAX(codPAUS) FROM presupuestoautousado)`;
		rs = await pool.query(sql);
		data = {
			...data,
			nomProp: rs[0].nom,
			apeProp: rs[0].ape,
			tdocProp: rs[0].tipodoc,
			ndocProp: rs[0].nrodoc,
			telProp: rs[0].tel,
			mailProp: rs[0].mail,
			direcProp: rs[0].direc,
			contrato: rs[0].codC,
		};
		res.render("./compras/c6/presAutoUsado", { data });
	} catch (err) {
		console.log(err);
		res.render("./compras/c6", { msg: err });
	}
});

async function cargarAutos() {
	var sql, rs;
	sql = `SELECT marca, modelo, precioventa precio, concat(nom,' ',ape) propietario, 
    concat(tipodoc,' ', nrodoc) documento, codC contrato, color
    FROM autousado A, contrato C, propietario P, persona Per WHERE A.borrado=0 AND Per.borrado=0 AND 
    P.borrado=0 AND C.codAU=A.codAU AND A.codP=P.codP AND P.codper=Per.codPer`;
	rs = await pool.query(sql);
	var autos = [];
	rs.forEach((a) =>
		autos.push({
			marca: a.marca,
			modelo: a.modelo,
			precio: a.precio,
			propietario: a.propietario,
			documento: a.documento,
			contrato: a.contrato,
			color: a.color,
		})
	);
	return autos;
}
export default router;