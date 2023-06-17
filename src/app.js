import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import authentication from "./routes/authentication.js";
import links from "./routes/links.js";

//IMPORTS DE mysql-nodejs
import morgan from "morgan";
import session from "express-session";
import validator from "express-validator";
import passport from "passport";
import flash from "connect-flash";
import bodyParser from "body-parser";
import "./lib/passport.js";

//Import Routes
import routes from "./routes/routes.js";
//c2
import routesc2b1 from "./routes/c2/b1.js";
import routesc2b2 from "./routes/c2/b2.js";
import routesc2b3 from "./routes/c2/b3.js";

import expressMysqlSession from "express-mysql-session";
const MySQLStore = expressMysqlSession(session);

import { database } from "./keys.js";

// Initializations
const app = express();

//Settings
const __dirname = dirname(fileURLToPath(import.meta.url)); //Guardo la ruta absoluta de direccion actual
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(express.urlencoded({ extended: false })); //Es para recibir formularios como objetos json
//Other uses
app.use(
	session({
		secret: "faztmysqlnodemysql",
		resave: false,
		saveUninitialized: false,
		store: new MySQLStore(database),
	})
);
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());

//Use of routes

// Routes
app.use(routes);
app.use(authentication);
app.use("/links", links);

//c1

//c2
app.use(routesc2b1);
app.use(routesc2b2);
app.use(routesc2b3);
//c3
//app.use(routesc3b1);
//app.use(routesc3b2);
//app.use(routesc3b3);
//app.use(routesc3b4);

// Global variables
app.use((req, res, next) => {
	app.locals.message = req.flash("message");
	app.locals.success = req.flash("success");
	app.locals.user = req.user;
	next();
});

// Public
app.use(express.static(join(__dirname, "public")));

// Starting
app.listen(app.get("port"), () => {
	console.log("Server is in port", app.get("port"));
});
