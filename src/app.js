
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import authentication from "./routes/authentication.js";
import links from "./routes/links.js";
import abmApp from "./views/ABM/app.js";
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
//c1
import routesc1b1 from "./routes/c1/b1.js";
import routesc1b2 from "./routes/c1/b2.js";
import routesc1b3 from "./routes/c1/b3.js";
import routesc1b4 from "./routes/c1/b4.js";
import routesc1b5 from "./routes/c1/b5.js";
import routesc1b6 from "./routes/c1/b6.js";
import routesc1b7 from "./routes/c1/b7.js";
import routesc1b8 from "./routes/c1/b8.js";
//c2
import routesc2b1 from "./routes/c2/b1.js";
import routesc2b2 from "./routes/c2/b2.js";
import routesc2b3 from "./routes/c2/b3.js";
//c3
import routesc3b1 from "./routes/c3/b1.js";
import routesc3b2 from "./routes/c3/b2.js";
import routesc3b3 from "./routes/c3/b3.js";
import routesc3b4 from "./routes/c3/b4.js";
//c4
import routesc4b1 from "./routes/c4/b1.js";
import routesc4b2 from "./routes/c4/b2.js";
import routesc4b3 from "./routes/c4/b3.js";
import routesc4b4 from "./routes/c4/b4.js";
import routesc4b5 from "./routes/c4/b5.js";

//c5
import routesc5b1 from "./routes/c5/b1.js";
import routesc5b2 from "./routes/c5/b2.js";
import routesc5b3 from "./routes/c5/b3.js";

//c6&7 --> c6
import routesc6b1 from "./routes/c6/b1.js";
import routesc6b2 from "./routes/c6/b2.js";
import routesc6b3 from "./routes/c6/b3.js";
import routesc6b4 from "./routes/c6/b4.js";
import routesc6b5 from "./routes/c6/b5.js";
import routesc6b6 from "./routes/c6/b6.js";

//c8
import routesc8b1 from "./routes/c8/b1.js";
import routesc8b2 from "./routes/c8/b2.js";
import routesc8b3 from "./routes/c8/b3.js";

//c9
import routesc9b1 from "./routes/c9/b1.js";
import routesc9b2 from "./routes/c9/b2.js";

import expressMysqlSession from "express-mysql-session";
const MySQLStore = expressMysqlSession(session);

import { database } from "./keys.js";

// Initializations
const app = express();

//Settings
const __dirname = dirname(fileURLToPath(import.meta.url)); //Guardo la ruta absoluta de direccion actual
//app.set("port", process.env.PORT || 3000);
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
app.use(routesc1b1);
app.use(routesc1b2);
app.use(routesc1b3);
app.use(routesc1b4);
app.use(routesc1b5);
app.use(routesc1b6);
app.use(routesc1b7);
app.use(routesc1b8);

//c2
app.use(routesc2b1);
app.use(routesc2b2);
app.use(routesc2b3);
//c3
app.use(routesc3b1);
app.use(routesc3b2);
app.use(routesc3b3);
app.use(routesc3b4);

//c4
app.use(routesc4b1);
app.use(routesc4b2);
app.use(routesc4b3);
app.use(routesc4b4);
app.use(routesc4b5);

//c5
app.use(routesc5b1);
app.use(routesc5b2);
app.use(routesc5b3);

//c6
app.use(routesc6b1);
app.use(routesc6b2);
app.use(routesc6b3);
app.use(routesc6b4);
app.use(routesc6b5);
app.use(routesc6b6);

//c8
app.use(routesc8b1);
app.use(routesc8b2);
app.use(routesc8b3);

//c9
app.use(routesc9b1);
app.use(routesc9b2);


// Global variables
app.use((req, res, next) => {
	app.locals.message = req.flash("message");
	app.locals.success = req.flash("success");
	app.locals.user = req.user;
	next();
});

// Public
app.use(express.static(join(__dirname, "public")));

// Utiliza el mismo puerto o elige uno diferente si es necesario
const PORT = process.env.PORT || 3000;

// Combine los middlewares y rutas del subsistema con el sistema principal
app.use(abmApp);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Sistema Principal en ejecución en http://localhost:${PORT}`);
});