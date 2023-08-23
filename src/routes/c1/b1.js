import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";
//Modificacion en la logica del sistema original: El cliente una vez registrado no se elimina aunque la operacion de compra sea cancelada.
async function cargarAutos() {
	var sql, rs;
	sql = `SELECT marca, modelo, precio, color FROM autodisponible0km WHERE borrado=0`;
	rs = await pool.query(sql);
	var autos = [];
	rs.forEach((a) =>
		autos.push({
			marca: a.marca,
			modelo: a.modelo,
			precio: a.precio,
			color: a.color,
		})
	);
	return autos;
}

router.get("/c1/b1/start", isLoggedIn, (req, res) => {
	res.render("./compras/c1/verifCliente", { enable: false });
});

router.post("/c1/b1/verifCliente", isLoggedIn, async (req, res) => {
	var msg, sql, rs;
	try {
		var nom = req.body.nom;
		var ape = req.body.ape;
		var tdoc = req.body.tdoc;
		var ndoc = req.body.ndoc;
		if (nom == null || ape == null || tdoc == null || ndoc == null) {
			res.render("./compras/c1/verifCliente", {
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
				res.render("./compras/c1/compra", { autos, nom, ape, ndoc, tdoc });
			} else {
				//El cliente no esta registrado como Cliente
				//Modificacion a la logica del sistema: Ya sea que el cliente este o no registrado como persona. Mientras no este registrado como cliente se pediran el resto de los datos y luego se verificara antes de hacer el insert si existe o no la persona ya
				res.render("./compras/c1/verifCliente", {
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
		res.render("./compras/c1/verifCliente", { enable: false, msg: err });
	}
});

router.post("/c1/b1/ingresarCliente", isLoggedIn, async (req, res) => {
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
		console.log(autos);
		res.render("./compras/c1/compra", { autos, nom, ape, ndoc, tdoc });
	} catch (err) {
		console.log(err);
		res.render("./compras/c1", { msg: err });
	}
});

router.post("/c1/b1/ordenCompra", isLoggedIn, async (req, res) => {
	var sql,
		rs,
		msg,
		nom,
		ape,
		tdoc,
		ndoc,
		direc,
		tel,
		mail,
		requisitos,
		fecha,
		codCL,
		codFP,
		codODC,
		formaPago,
		marca,
		modelo,
		precio,
		color,
		codAD0KM,
		data,
		codPer;
	try {
		nom = req.body.nom;
		ape = req.body.ape;
		tdoc = req.body.tdoc;
		ndoc = req.body.ndoc;

		marca = req.body.marca;
		modelo = req.body.modelo;
		precio = req.body.precio;
		color = req.body.color;

		formaPago = req.body.seleccion;
		//Busco el codigo de persona y de cliente

		sql = `SELECT codPer, direc, tel, mail from Persona WHERE tipodoc = '${tdoc}' 
		AND nrodoc = '${ndoc}' AND nom = '${nom}' AND ape = '${ape}'`;
		rs = await pool.query(sql);

		codPer = rs[0].codPer;
		direc = rs[0].direc;
		tel = rs[0].tel;
		mail = rs[0].mail;

		if (formaPago === "Credito Prendario") {
			//El cliente quiere pagar con credito.
			sql = `SELECT requisitos FROM cliente WHERE codper=${codPer}`;
			rs = await pool.query(sql);
			if (rs[0].requisitos === false) {
				//El cliente no cumple los requisitos.
				msg =
					"No puede comprar el automóvil mediante crédito prendario porque no cumple con los requisitos.";
				res.render("/c1", { msg });
			}
		} else {
			formaPago = "Efectivo";
		}

		sql = `SELECT codCL FROM cliente WHERE codper=${codPer}`;
		rs = await pool.query(sql);
		codCL = rs[0].codCL;
		sql = `SELECT codad0km FROM autodisponible0km 
		WHERE marca='${marca}' and modelo='${modelo}'`;
		rs = await pool.query(sql);
		codAD0KM = rs[0].codad0km;
		sql = `SELECT codFP FROM formapago WHERE descripcion='${formaPago}'`;
		rs = await pool.query(sql);
		codFP = rs[0].codFP;

		sql = `INSERT into ordendecompra 
		values('',${codCL},${codAD0KM},${codFP},curdate(),FALSE)`;
		await pool.query(sql);

		sql = "select Max(codODC) codODC from ordendecompra";
		rs = await pool.query(sql);
		codODC = rs[0].codODC;

		sql = "select curdate() fecha";
		rs = await pool.query(sql);
		fecha = rs[0].fecha;

		var comprador = `${nom} ${ape}`;
		var docComprador = `${tdoc.toUpperCase()}: ${ndoc}`;

		data = {
			comprador,
			docComprador,
			direc,
			tel,
			mail,
			marca,
			modelo,
			precio,
			color,
			direc,
			tel,
			mail,
			fecha,
			codODC,
			formaPago,
		};
		res.render("./compras/c1/printODC", { data });
	} catch (err) {
		console.log(err);
		res.render("./compras/c1", { msg: err });
	}
});

export default router;
