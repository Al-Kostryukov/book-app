const mysql = require('mysql');
const {promisify} = require('util');
const config = require('./config');
const connection = mysql.createConnection(config.mysql);

connection.query = promisify(connection.query);
connection.beginTransaction = promisify(connection.beginTransaction);
connection.commit = promisify(connection.commit);
connection.rollback = promisify(connection.rollback);

module.exports = connection;