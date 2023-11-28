const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
//const port = 4000;
const connection = require('./dbConnection'); 
// Middleware para el manejo de datos JSON
app.use(express.json());

// Middleware para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Agregar middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Agregar el middleware de express-session
app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true
  })
);

// Middleware para la notificación de mensajes
app.use((req, res, next) => {
  res.locals.successMessage = req.session.successMessage;
  res.locals.errorMessage = req.session.errorMessage;
  delete req.session.successMessage;
  delete req.session.errorMessage;
  next();
});

// Exportar la conexión a la base de datos para que esté disponible en otros archivos
module.exports.connection = connection;
module.exports = app;

// Importar los archivos de rutas
const getRoutes = require('./routes/getRoutes');
const postRoutes = require('./routes/postRoutes');
const putRoutes = require('./routes/putRoutes');
const deleteRoutes = require('./routes/deleteRoutes');

// Usar los archivos de rutas como middleware
app.use(getRoutes);
app.use(postRoutes);
app.use(putRoutes);
app.use(deleteRoutes);

// Iniciar el servidor
//app.listen(port, () => {
//  console.log(`Sistema ABM en ejecución en http://localhost:${port}`);
//});
