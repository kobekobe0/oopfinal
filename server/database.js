const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'bug_tracker',
    multipleStatements: true,
})

module.exports = connection
