import express from "express";
// import ejs from "ejs"; //express es un framework que tiene integracion con ejs por defecto, se puede obviar la importacion de ejs
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import routes from "./routes/routes.js";
import authentication from "./routes/authentication.js";
import links from "./routes/links.js";

//import cors from "cors"; Esto se usa en la api que hicimos con flavio pero no se para que todavia

//IMPORTS DE mysql-nodejs
import morgan from "morgan";
import { engine } from "express-handlebars";
import session from "express-session";
import validator from "express-validator";
import passport from "passport";
import flash from "connect-flash";
import bodyParser from "body-parser";

import expressMysqlSession from "express-mysql-session";
const MySQLStore = expressMysqlSession(session);

import { database } from "./keys.js";

// Initializations
const app = express();
import * as LibPassport from "./lib/passport.js";

//Settings
const __dirname = dirname(fileURLToPath(import.meta.url)); //Guardo la ruta absoluta de direccion actual
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views")); //Sirve para decirle a express donde tenemos la carpeta de las vistas.

app.set("view engine", "ejs"); //Sirve para poder añadir logica de programaciond entro del html

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
		secret: "faztmysqlnodemysql",
		resave: false,
		saveUninitialized: false,
		store: new MySQLStore(database),
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());

// Global variables
app.use((req, res, next) => {
	app.locals.message = req.flash("message");
	app.locals.success = req.flash("success");
	app.locals.user = req.user;
	next();
});

// Routes
app.use(routes);
app.use(authentication);
app.use("/links", links);

// Public
app.use(express.static(join(__dirname, "public")));

// Starting
app.listen(app.get("port"), () => {
	console.log("Server is in port", app.get("port"));
});
