const mysql      = require('mysql');
const {promisify} = require('util');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'me',
    password : 'secret',
    database : 'my_db'
});

connection.query = promisify(connection.query);

module.exports = connection;