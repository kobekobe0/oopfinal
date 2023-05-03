const mysql = require('mysql')

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'bug_tracker',
    multipleStatements: true,
})

const CreateUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    try {
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'bug_tracker',
        })

        connection.connect((err) => {
            if (err) throw err
        })

        const createUser = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `INSERT INTO users (name, password, email) SELECT '${name}', '${password}', '${email}' WHERE NOT EXISTS (SELECT email FROM users WHERE email = '${email}');`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results)
                        connection.end()
                    }
                )
            })
        }

        createUser()
            .then((results) => {
                if (results.affectedRows > 0) {
                    return res.status(201).json({
                        message: 'User created successfully',
                        success: true,
                    })
                } else {
                    return res.status(400).json({
                        message: 'User already exists',
                        success: false,
                    })
                }
            })
            .catch((err) => {
                throw new Error(err)
            })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const LoginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'bug_tracker',
        })

        connection.connect((err) => {
            if (err) throw err
        })

        const loginUser = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results)
                        connection.end()
                    }
                )
            })
        }

        loginUser()
            .then((results) => {
                if (results.length === 0)
                    return res.status(401).json({ message: 'User not found' })
                return res.status(200).json(results[0])
            })
            .catch((err) => {
                throw new Error(err, {
                    message: 'Something went wrong',
                })
            })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//search user
const GetUsers = async (req, res) => {
    const { userName } = req.body
    try {
        const query = `SELECT * FROM users WHERE name LIKE '%${userName}%'`
        db.query(query, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Error searching user',
                    error: err,
                    success: false,
                })
            }
            res.status(200).json({
                message: 'User found',
                success: true,
                data: result,
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { CreateUser, LoginUser, GetUsers }
