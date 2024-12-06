const mysql = require('mysql2');

// Create connection to the database:
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'comp206'
});

// Connect to MySQL database:
connection.connect(function(err) {
  if (err) {
    console.error('ERROR. Could not connect: ' + err.stack);
    return;
  }
  console.log('Connected to database as ID: ' + connection.threadId);
});

module.exports = connection;