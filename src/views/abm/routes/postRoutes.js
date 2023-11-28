const express = require('express');
const router = express.Router();

// Importar la variable connection desde app.js
//const connection = require('../app').connection;
const connection = require('../dbConnection'); // La ruta puede variar dependiendo de la estructura de tu proyecto

// Ruta para procesar el formulario y agregar el auto 0km a la base de datos
router.post('/agregar-auto-0km', (req, res) => {
  const { marca, modelo, precio, color } = req.body;
  const borrado = 0;

  const query = 'INSERT INTO autodisponible0km (marca, modelo, precio, color, borrado) VALUES (?, ?, ?, ?, ?)';
  const values = [marca, modelo, precio, color, borrado];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al agregar el auto:', err);
      req.session.errorMessage = 'No se pudieron cargar los datos';
    } else {
      console.log('Auto agregado correctamente a la base de datos.');
      req.session.successMessage = 'Auto Registrado Exitosamente';
    }
    res.redirect('/agregar-auto-0km');
  });
});

// Ruta para procesar el formulario y agregar el accesorio a la base de datos
router.post('/agregar-accesorio', (req, res) => {
  const {nombre, PU, stock} = req.body;
  const borrado = 0;

  const query = 'INSERT INTO accesorio (nombre, PU, stock, borrado) VALUES (?, ?, ?, ?)';
  const values = [nombre, PU, stock, borrado];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al agregar el accesorio:', err);
      req.session.errorMessage = 'No se pudieron cargar los datos';
    } else {
      console.log('Accesorio agregado correctamente a la base de datos.');
      req.session.successMessage = 'Accesorio Registrado Exitosamente';
    }
    res.redirect('/agregar-accesorio');
  });
});

// Ruta para verificar si el usuario ya existe en la base de datos
router.post('/verificar-usuario', (req, res) => {
  const { nickname } = req.body;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuario WHERE username = ?';
  if (connection.state === 'disconnected') {
    connection.connect(); // Conectar si la conexión está cerrada
  }
  connection.query(checkQuery, [nickname], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error al verificar el usuario:', checkErr);
      res.status(500).json({ error: 'Hubo un error al verificar el usuario.' });
    } else {
      const userExists = checkResult[0].count > 0;
      res.status(200).json({ exists: userExists });
    }
  });
});

// Ruta para procesar el formulario y agregar el usuario a la base de datos
router.post('/agregar-usuario', (req, res) => {
  const { nickname, password, permisoAdmin, abm, compras, posventa, contratos } = req.body;
  const borrado = 0;

  // Verificar si el usuario ya existe en la base de datos
  const checkQuery = 'SELECT COUNT(*) as count FROM usuario WHERE username = ?';
  connection.query(checkQuery, [nickname], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error al verificar el usuario:', checkErr);
      req.session.errorMessage = 'Error al verificar el usuario';
      res.json({ success: false }); // Envía una respuesta JSON indicando el error
    } else {
      if (checkResult[0].count > 0) {
        console.log('El usuario ya existe en la base de datos.');
        const errorMessage = 'El nickname ya existe en la base de datos. Por favor, vuelve a intentarlo.';
        req.session.errorMessage = errorMessage;
        res.json({ success: false, message: errorMessage }); // Envía una respuesta JSON con el mensaje de error
      } else {
        // Insertar el usuario si no existe previamente
        const insertQuery = 'INSERT INTO usuario (username, password, PermisoAdmin, ABM, Compras, Posventa, Contratos, borrado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [nickname, password, permisoAdmin, abm, compras, posventa, contratos, borrado];

        connection.query(insertQuery, insertValues, (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error al agregar el usuario:', insertErr);
            req.session.errorMessage = 'No se pudieron cargar los datos';
            res.json({ success: false }); // Envía una respuesta JSON indicando el error
          } else {
            console.log('Usuario agregado correctamente a la base de datos.');
            req.session.successMessage = 'Usuario Registrado Exitosamente';
            res.json({ success: true }); // Envía una respuesta JSON indicando el éxito
          }
        });
      }
    }
  });
});

// Ruta para procesar el formulario y agregar el auto 0km a la base de datos
router.post('/agregar-reparacion', (req, res) => {
  const {nombre, precio, detalle} = req.body;
  const borrado = 0;

  const query = 'INSERT INTO reparaciondisponible (nombre, PU, detalles, borrado) VALUES (?, ?, ?, ?)';
  const values = [nombre, precio, detalle, borrado];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al agregar la reparación:', err);
      req.session.errorMessage = 'No se pudieron cargar los datos';
    } else {
      console.log('Reparación agregada correctamente a la base de datos.');
      req.session.successMessage = 'Reparación Registrada Exitosamente';
    }
    res.redirect('/agregar-reparacion');
  });
});

//Exportar el router
module.exports = router;