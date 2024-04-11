const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  database: 'student_clubs'
});

db.connect((err) => {
  if (err) throw err;
});

module.exports = db;
