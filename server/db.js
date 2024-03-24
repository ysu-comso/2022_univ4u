const mysql = require('mysql2');

const connection = mysql.createConnection({
    host : 'lemontree.cafe24app.com',
    user : 'lemontree14',
    password : 'lemon134@',
    database : 'lemontree14'
});

module.exports = connection;