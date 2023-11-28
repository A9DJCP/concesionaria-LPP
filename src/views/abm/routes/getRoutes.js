const express = require('express');
const router = express.Router();

// Ruta para mostrar la página principal del Menú ABM (ruta raíz)
router.get('/', (req, res) => {
  res.render('abm_menu', { title: 'Menú de Gestión - ABM' });
});

// Ruta para mostrar el formulario de agregar auto
router.get('/agregar-auto-0km', (req, res) => {
  res.render('agregar_auto0km', { title: 'Agregar Auto 0KM - ABM' });
});

// Ruta para mostrar el formulario de modificar auto
router.get('/modificar-auto-0km', (req, res) => {
  res.render('modificar_auto0km', { title: 'Modificar Auto 0KM - ABM' });
});

// Ruta para mostrar el formulario de borrar auto
router.get('/borrar-auto-0km', (req, res) => {
  res.render('borrar_auto0km', { title: 'Borrar Auto 0KM - ABM' });
});

// Ruta para mostrar el formulario de agregar accesorio
router.get('/agregar-accesorio', (req, res) => {
  res.render('agregar_accesorio', { title: 'Agregar Accesorio - ABM' });
});


// Ruta para mostrar el formulario de modificar accesorio
router.get('/modificar-accesorio', (req, res) => {
  res.render('modificar_accesorio', { title: 'Modificar Accesorio - ABM' });
});

// Ruta para mostrar el formulario de borrar accesorio
router.get('/borrar-accesorio', (req, res) => {
  res.render('borrar_accesorio', { title: 'Borrar Accesorio - ABM' });
});

// Ruta para mostrar el formulario de agregar usuario
router.get('/agregar-usuario', (req, res) => {
  res.render('agregar_usuario', { title: 'Agregar Usuario - ABM' });
});

// Ruta para mostrar el formulario de modificar usuario
router.get('/modificar-usuario', (req, res) => {
  res.render('modificar_usuario', { title: 'Modificar Usuario - ABM' });
});

// Ruta para mostrar el formulario de borrar usuario
router.get('/borrar-usuario', (req, res) => {
  res.render('borrar_usuario', { title: 'Borrar Usuario - ABM' });
});

// Ruta para mostrar el formulario de agregar reparaciones
router.get('/agregar-reparacion', (req, res) => {
  res.render('agregar_reparacion', { title: 'Agregar Reparación - ABM' });
});

// Ruta para mostrar el formulario de modificar reparaciones
router.get('/modificar-reparacion', (req, res) => {
  res.render('modificar_reparacion', { title: 'Modificar Reparación - ABM' });
});

// Ruta para mostrar el formulario de borrar reparaciones
router.get('/borrar-reparacion', (req, res) => {
  res.render('borrar_reparacion', { title: 'Borrar Reparación - ABM' });
});

// Ruta para mostrar el formulario de modificar auto usado
router.get('/modificar-auto-usado', (req, res) => {
  res.render('modificar_auto_usado', { title: 'Modificar Auto Usado - ABM' });
});

// Ruta para mostrar el formulario de borrar auto usado
router.get('/borrar-auto-usado', (req, res) => {
  res.render('borrar_auto_usado', { title: 'Borrar Auto Usado - ABM' });
});

// Ruta para mostrar el formulario de modificar clientes
router.get('/modificar-cliente', (req, res) => {
  res.render('modificar_cliente', { title: 'Modificar Cliente - ABM' });
});

// Ruta para mostrar el formulario de borrar clientes
router.get('/borrar-cliente', (req, res) => {
  res.render('borrar_cliente', { title: 'Borrar Cliente - ABM' });
});

// Ruta para mostrar el formulario de modificar personas
router.get('/modificar-persona', (req, res) => {
  res.render('modificar_persona', { title: 'Modificar Persona - ABM' });
});

// Ruta para mostrar el formulario de borrar personas
router.get('/borrar-persona', (req, res) => {
  res.render('borrar_persona', { title: 'Borrar Persona - ABM' });
});

// Ruta para mostrar el formulario de borrar morosos
router.get('/borrar-moroso', (req, res) => {
  res.render('borrar_moroso', { title: 'Borrar Moroso - ABM' });
});


// Ruta para mostrar el formulario de modificar porcentaje
router.get('/modificar-porcentaje', (req, res) => {
  res.render('modificar_porcentaje', { title: 'Modificar Porcentaje - ABM' });
});

// Ruta para mostrar el formulario de borrar propietario
router.get('/borrar-propietario', (req, res) => {
  res.render('borrar_propietario', { title: 'Borrar Propietario - ABM' });
});

// Importar la conexión a la base de datos desde app.js
//const { connection } = require('../app');
const connection = require('../dbConnection'); // La ruta puede variar dependiendo de la estructura de tu proyecto


// Ruta para obtener autos filtrados por marca
router.get('/obtener-autos-por-marca', (req, res) => {
  const { marca } = req.query;
  const query = 'SELECT * FROM autodisponible0km WHERE marca LIKE ?';
  connection.query(query, [`%${marca}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener autos por marca:', err);
      res.status(500).json({ error: 'Error al obtener autos por marca.' });
    } else {
      console.log('Autos obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});

// Ruta para obtener accesorios filtrados por nombre
router.get('/obtener-accesorios-por-nombre', (req, res) => {
  const { nombre } = req.query;
  const query = 'SELECT * FROM accesorio WHERE nombre LIKE ?';
  connection.query(query, [`%${nombre}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener accesorios por nombre:', err);
      res.status(500).json({ error: 'Error al obtener accesorios por nombre.' });
    } else {
      console.log('Accesorios obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});


// Ruta para obtener reparaciones filtradas por nombre
router.get('/obtener-reparaciones-por-nombre', (req, res) => {
  const { nombre } = req.query;
  const query = 'SELECT * FROM reparaciondisponible WHERE nombre LIKE ?';
  connection.query(query, [`%${nombre}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener reparaciones por nombre:', err);
      res.status(500).json({ error: 'Error al obtener reparaciones por nombre.' });
    } else {
      console.log('Reparaciones obtenidas exitosamente:', result);
      res.json(result);
    }
  });
});

// Ruta para obtener autos filtrados por marca
router.get('/obtener-autos-usados-por-marca', (req, res) => {
  const { marca } = req.query;
  const query = 'SELECT * FROM autousado WHERE marca LIKE ?';
  connection.query(query, [`%${marca}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener autos usados por marca:', err);
      res.status(500).json({ error: 'Error al obtener autos usados por marca.' });
    } else {
      console.log('Autos usados obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});


// Ruta para obtener clientes filtrados por número de documento
router.get('/obtener-clientes-por-nrodoc', (req, res) => {
  const { nrodoc } = req.query;
  const query = `
  SELECT p.codPer, p.nom, p.ape, p.nrodoc, p.mail, c.requisitos, c.borrado
  FROM persona AS p
  INNER JOIN cliente AS c ON p.codPer = c.codPer
  WHERE p.nrodoc LIKE ? AND c.borrado = 0
  `;
  
  connection.query(query, [`%${nrodoc}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener clientes por número de documento:', err);
      res.status(500).json({ error: 'Error al obtener clientes por número de documento.' });
    } else {
      console.log('Clientes obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});

// Ruta para obtener personas filtradas por apellido
router.get('/obtener-personas-por-ape', (req, res) => {
  const { ape } = req.query;
  const query = 'SELECT * FROM persona WHERE ape LIKE ?';
  connection.query(query, [`%${ape}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener personas por apellido:', err);
      res.status(500).json({ error: 'Error al obtener personas por apellido.' });
    } else {
      console.log('Personas obtenidas exitosamente:', result);
      res.json(result);
    }
  });
});


// Ruta para obtener propietarios filtrados por apellido
router.get('/obtener-propietarios-por-apellido', (req, res) => {
  const { apellido } = req.query; // Cambio en el nombre del parámetro
  const query = `
  SELECT * FROM persona AS p
  INNER JOIN propietario AS pr ON p.codPer = pr.codPer
  WHERE p.ape LIKE ?  
  `;
  
  connection.query(query, [`%${apellido}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener propietarios por apellido:', err);
      res.status(500).json({ error: 'Error al obtener propietarios por apellido.' });
    } else {
      console.log('Propietarios obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});

// Ruta para obtener propietarios filtrados por apellido
router.get('/obtener-morosos-por-apellido', (req, res) => {
  const { apellido } = req.query; // Cambio en el nombre del parámetro
  const query = `
  SELECT * FROM persona AS p
  INNER JOIN cliente AS cl ON p.codPer = cl.codPer
  INNER JOIN moroso AS mo ON cl.codCL = mo.codCL
  WHERE p.ape LIKE ?  
  `;
  
  connection.query(query, [`%${apellido}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener morosos por apellido:', err);
      res.status(500).json({ error: 'Error al obtener morosos por apellido.' });
    } else {
      console.log('Morosos obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});

// Ruta para obtener usuarios filtrados por username
router.get('/obtener-usuarios-por-username', (req, res) => {
  const { username } = req.query;
  const query = 'SELECT * FROM usuario WHERE username LIKE ?';
  connection.query(query, [`%${username}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener usuarios por username:', err);
      res.status(500).json({ error: 'Error al obtener usuarios por username.' });
    } else {
      console.log('Usuarios obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});


// Ruta para obtener porcentajes filtrados por descripcion
router.get('/obtener-porcentajes-por-descripcion', (req, res) => {
  const { descripcion } = req.query;
  const query = 'SELECT * FROM porcentaje WHERE descripcion LIKE ?';
  connection.query(query, [`%${descripcion}%`], (err, result) => {
    if (err) {
      console.error('Error al obtener porcentajes por descripción:', err);
      res.status(500).json({ error: 'Error al obtener porcentajes por descripción.' });
    } else {
      console.log('Porcentajes obtenidos exitosamente:', result);
      res.json(result);
    }
  });
});
// Exporta el router
module.exports = router;