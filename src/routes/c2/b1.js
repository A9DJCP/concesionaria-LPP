import { Router } from "express"; //Importo router para poder usarlo en lugar del app.
import { isLoggedIn } from "../../lib/auth.js";
const router = Router();
import pool from "../../database.js";

var codA0KM = -1;

//BOTON 1
router.get("/c2/b1/procRep0km", isLoggedIn, (req, res) => {
	// 	frmC2_ProcesarReparacionAuto0km.btnRegistrarAuto.Enabled = False
	res.render("./posventa/c2/formularioReparacion", {
		enable: false,
		msg: null,
		block: false,
	});
});

router.post("/verReclamosDisponibles", isLoggedIn, async (req, res) => {
	let matricula, marca, modelo, codF, numS;
	try {
		matricula = req.body.matricula;
		marca = req.body.marca;
		modelo = req.body.modelo;
		codF = req.body.codfabrica;
		numS = parseInt(req.body.numseguro);
		if (numS === NaN) {
			numS = -1;
		}
		var sql = `	SELECT COUNT(*) cont
		FROM docauto0km DA, auto0km A, seguro0KM S, TipoSeguro TS 
		WHERE S.codA0KM=A.codA0KM and A.codDA0KM=DA.codDA0KM and TS.codTS=S.codTS and marca='${marca}'
		AND modelo='${modelo}' AND codigodefabrica ='${codF}' AND matricula='${matricula}'
		AND codS0KM = ${numS}`;
		var result = await pool.query(sql);
		var existe = result[0].cont;
		if (existe >= 1) {
			sql = `select COUNT(*) cont from seguro0Km where estado='Vigente' and codS0KM=${numS}`;
			result = await pool.query(sql);
			existe = result[0].cont;
			if (existe) {
				sql = `select codA0KM from seguro0KM where codS0KM= ${numS}`;
				result = await pool.query(sql);
				codA0KM = result[0].codA0KM;
				sql = `SELECT descripcion from condicion C, condiciontiposeguro CTS, seguro0km S, tiposeguro TS 
				WHERE s.codTS=TS.codTS AND TS.codTS=CTS.codTS AND CTS.codCOND=C.codCOND AND codS0KM=${numS}`;
				var descripciones = await pool.query(sql);
				var array = [];
				descripciones.forEach((v) => array.push(v.descripcion));
				res.render("./posventa/c2/formularioReparacion", {
					enable: true,
					desc: array,
					msg: null,
					block: true,
					matricula,
					marca,
					modelo,
					codF,
					numS,
				});
			} else {
				res.render("./posventa/c2/formularioReparacion", {
					enable: false,
					msg: "El seguro está vencido por lo que no se puede realizar el reclamo",
					block: false,
				});
			}
		} else {
			res.render("./posventa/c2/formularioReparacion", {
				enable: false,
				msg: "El automóvil ingresado no esta registrado",
				block: false,
			});
		}
	} catch (error) {
		res.render("./posventa/c2/formularioReparacion", {
			enable: false,
			msg: "Los Datos ingresados son inválidos",
			block: false,
		});
	}
});

router.post("/posventa/c2/ingresarAuto", async (req, res) => {
	try {
		await pool.query(
			`insert into analisisauto0km values ('',${codA0KM},curdate(),'Analisis en progreso')`
		);
		// Ver como hacer funcionar el req.flash
		// req.flash(
		// 	"success",
		// 	"El automóvil ha sido registrado y está listo para ser enviado al taller y analizarlo."
		// );
		res.render("./posventa/c2/formularioReparacion", {
			enable: false,
			msg: "El automóvil ha sido registrado y está listo para ser enviado al taller y analizarlo.",
			block: false,
		});
	} catch (error) {
		res.render("./posventa/c2/formularioReparacion", {
			enable: false,
			msg: "Sucedió un error inesperado",
			block: false,
		});
	}
});

export default router;
