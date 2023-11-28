const express = require('express');
const router = express.Router();

// Importar la conexión a la base de datos desde app.js
//const { connection } = require('../app');
const connection = require('../dbConnection'); // La ruta puede variar dependiendo de la estructura de tu proyecto

router.put('/modificar-auto-0km', (req, res) => {
  const {marca, codAD0KM, modelo, precio, color } = req.body;

  // Realizar la modificación en la base de datos
  const query = 'UPDATE autodisponible0km SET marca = ?, modelo = ?, precio = ?, color = ? WHERE codAD0KM = ?';
  console.log('Query:', query);
  connection.query(query, [marca, modelo, precio, color, codAD0KM], (err, result) => {
    if (err) {
      console.error('Error al modificar el auto:', err);
      req.session.errorMessage = 'Error al modificar el auto.';
      res.status(500).send('Error al modificar el auto.'); // Enviar una respuesta de error al cliente
    } else {
      console.log('Auto modificado exitosamente:', result);
      req.session.successMessage = 'Auto modificado exitosamente.';
      res.send('Auto modificado exitosamente'); // Enviar una respuesta exitosa al cliente
    }
  });
});


router.put('/modificar-accesorio', (req, res) => {
  const {nombre, codACC, PU, stock} = req.body;

  // Realizar la modificación en la base de datos
  const query = 'UPDATE accesorio SET nombre = ?, PU = ?, stock = ? WHERE codACC = ?';
  console.log('Query:', query);
  connection.query(query, [nombre, PU, stock, codACC], (err, result) => {
    if (err) {
      console.error('Error al modificar el accesorio:', err);
      req.session.errorMessage = 'Error al modificar el accesorio.';
      res.status(500).send('Error al modificar el accesorio.'); // Enviar una respuesta de error al cliente
    } else {
      console.log('Accesorio modificado exitosamente:', result);
      req.session.successMessage = 'Accesorio modificado exitosamente.';
      res.send('Accesorio modificado exitosamente'); // Enviar una respuesta exitosa al cliente
    }
  });
});

router.put('/modificar-reparacion', (req, res) => {
  const {nombre, codRDISP, precio, detalle} = req.body;

  // Realizar la modificación en la base de datos
  const query = 'UPDATE reparaciondisponible SET nombre = ?, PU = ?, detalles = ? WHERE codRDISP = ?';
  console.log('Query:', query);
  connection.query(query, [nombre, precio, detalle, codRDISP], (err, result) => {
    if (err) {
      console.error('Error al modificar la reparación:', err);
      req.session.errorMessage = 'Error al modificar la reparación.';
      res.status(500).send('Error al modificar la reparación.'); // Enviar una respuesta de error al cliente
    } else {
      console.log('Reparación modificada exitosamente:', result);
      req.session.successMessage = 'Reparación modificada exitosamente.';
      res.send('Reparación modificada exitosamente'); // Enviar una respuesta exitosa al cliente
    }
  });
});

router.put('/modificar-usuario', (req, res) => {
  const { username, password, PermisoAdmin, ABM, Compras, Posventa, Contratos } = req.body;

  // Realizar la modificación en la base de datos
  const query = 'UPDATE usuario SET password = ?, PermisoAdmin = ?, ABM = ?, Compras = ?, Posventa = ?, Contratos = ? WHERE username = ?';
  connection.query(
    query,
    [password, PermisoAdmin, ABM, Compras, Posventa, Contratos, username],
    (err, result) => {
      if (err) {
        console.error('Error al modificar el usuario:', err);
        res.status(500).send('Error al modificar el usuario.'); // Enviar una respuesta de error al cliente
      } else {
        console.log('Usuario modificado exitosamente:', result);
        res.send('Usuario modificado exitosamente'); // Enviar una respuesta exitosa al cliente
      }
    }
  );
});


router.put('/modificar-auto-usado', (req, res) => {
  
  const {matricula, marca, modelo, precioventa, fechafabricacion, codP, uso, chasis, motor, color, codAU} = req.body;
  const sinvigencia = req.body.sinvigencia || 0;
  const checkeado = req.body.checkeado || 0;
  // Realizar la modificación en la base de datos
  const query = 'UPDATE autousado SET matricula = ?, marca = ?, modelo = ?, precioventa = ?, fechafabricacion = ?, codP = ?, uso = ?, chasis = ?, motor = ?, sinvigencia = ?, checkeado = ?, color = ? WHERE codAU = ?';
  console.log('Query:', query);
  connection.query(query, [matricula, marca, modelo, precioventa , fechafabricacion, codP, uso, chasis, motor, sinvigencia, checkeado, color, codAU], (err, result) => {
    if (err) {
      console.error('Error al modificar el auto:', err);
      req.session.errorMessage = 'Error al modificar el auto.';
      res.status(500).send('Error al modificar el auto.'); // Enviar una respuesta de error al cliente
    } else {
      console.log('Auto modificado exitosamente:', result);
      req.session.successMessage = 'Auto modificado exitosamente.';
      res.send('Auto modificado exitosamente'); // Enviar una respuesta exitosa al cliente
    }
  });
});

router.put('/modificar-persona', (req, res) => {
  const { tipodoc, nrodoc, nom, ape, direc, tel, mail, codPer } = req.body;

  // Realizar la modificación en la base de datos
  const query = 'UPDATE persona SET tipoDoc = ?, nrodoc = ?, nom = ?, ape = ?, direc = ?, tel = ?, mail = ? WHERE codPer = ?';
  console.log('Query:', query);
  connection.query(query, [tipodoc, nrodoc, nom, ape, direc, tel, mail, codPer], (err, result) => {
    if (err) {
      console.error('Error al modificar la persona:', err);
      req.session.errorMessage = 'Error al modificar la persona.';
      res.status(500).send('Error al modificar la persona.'); // Enviar una respuesta de error al cliente
    } else {
      console.log('Persona modificada exitosamente:', result);
      req.session.successMessage = 'Persona modificada exitosamente.';
      res.send('Persona modificada exitosamente'); // Enviar una respuesta exitosa al cliente
    }
  });
});

router.put('/modificar-porcentaje', (req, res) => {
  const {codPORC, descripcion, porcentaje} = req.body;

  // Realizar la modificación en la base de datos
  const query = 'UPDATE porcentaje SET descripcion = ?, porcentaje = ?  WHERE codPORC = ?';
  console.log('Query:', query);
  connection.query(query, [descripcion, porcentaje, codPORC], (err, result) => {
    if (err) {
      console.error('Error al modificar el porcentaje:', err);
      req.session.errorMessage = 'Error al modificar el porcentaje.';
      res.status(500).send('Error al modificar el porcentaje.'); // Enviar una respuesta de error al cliente
    } else {
      console.log('Porcentaje modificado exitosamente:', result);
      req.session.successMessage = 'Porcentaje modificado exitosamente.';
      res.send('Porcentaje modificado exitosamente'); // Enviar una respuesta exitosa al cliente
    }
  });
});

router.put('/modificar-cliente', (req, res) => {
  const { codPer, nom, ape, mail, requisitos } = req.body;

  // Iniciar la transacción
  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    // Realizar la modificación en la tabla persona
    const personaQuery = 'UPDATE persona SET nom = ?, ape = ?, mail = ? WHERE codPer = ?';
    connection.query(personaQuery, [nom, ape, mail, codPer], function (error, results, fields) {
      if (error) {
        return connection.rollback(function () {
          console.error('Error al modificar la persona:', error);
          req.session.errorMessage = 'Error al modificar la persona.';
          res.status(500).send('Error al modificar la persona.');
        });
      }

      // Realizar la modificación en la tabla cliente
      const clienteQuery = 'UPDATE cliente SET requisitos = ? WHERE codPer = ?';
      connection.query(clienteQuery, [requisitos, codPer], function (error, results, fields) {
        if (error) {
          return connection.rollback(function () {
            console.error('Error al modificar el cliente:', error);
            req.session.errorMessage = 'Error al modificar el cliente.';
            res.status(500).send('Error al modificar el cliente.');
          });
        }

        // Commit si no hay errores
        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              throw err;
            });
          }
          console.log('Cliente y persona modificados exitosamente.');
          req.session.successMessage = 'Cliente y persona modificados exitosamente.';
          res.send('Cliente y persona modificados exitosamente.');
        });
      });
    });
  });
});

module.exports = router;
