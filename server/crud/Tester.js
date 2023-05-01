const conn = require('../database.js')

const name = 'kobos'
const description = 'kobe bryant'

const sql = `INSERT INTO projects (name, description) VALUES('${name}', '${description}'); SELECT LAST_INSERT_ID();`
conn.connect((err) => {
    if (!err) {
        conn.query(sql, (err2, rows, fields) => {
            console.log(err2)
            if (!err2) {
                console.log(rows)
            }
            conn.end()
        })
    }
})
