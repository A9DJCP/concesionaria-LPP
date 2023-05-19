import express from "express";
// import ejs from "ejs"; //express es un framework que tiene integracion con ejs por defecto, se puede obviar la importacion de ejs
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import routes from "./routes/routes.js";
//import cors from "cors"; Esto se usa en la api que hicimos con flavio pero no se para que todavia

const app = express();

//app.use(cors());
//app.use(express.json()); Estas dos lineas se usan en la api que hicimos con flavio

const __dirname = dirname(fileURLToPath(import.meta.url)); //Guardo la ruta absoluta de direccion actual
app.set("views", join(__dirname, "views")); //Sirve para decirle a express donde tenemos la carpeta de las vistas.
//La funcion join concatena __dirname con views usando el operador de path dependiendo del SO donde se ejecute. En windows seria '\'
app.set("view engine", "ejs"); //Sirve para poder añadir logica de programaciond entro del html

app.use(routes); //Le indico a app que utilice las rutas del archivo routes.js
app.use(express.static(join(__dirname, "public")));

app.listen(3000);

console.log("Server is listening on port", 3000);
