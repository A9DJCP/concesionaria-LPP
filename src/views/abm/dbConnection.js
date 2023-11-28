// dbConnection.js
const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'concesionarialpp'
};

const connection = mysql.createConnection(dbConfig);

// Conectar a la base de datos
connection.connect((err) => {
  if (err) throw err;
  console.log('ABM conectado a la base de datos MySQL!');
});

module.exports = connection;
