const mysql = require('mysql')

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'bug_tracker',
    multipleStatements: true,
})

//------FOR ADMINS------//
//call CheckIfUserAdmin first before calling this
//add userId in the body
const CreateTicket = (req, res) => {
    const {
        title,
        description,
        projectId,
        priority,
        status,
        assignee,
        created_by,
    } = req.body //pwede null yung assignee
    const query = `INSERT INTO tickets (title, description, project_id, priority, status, assignee, created_by) VALUES ("${title}", "${description}", ${projectId}, "${priority}", "${status}", ${assignee}, ${created_by})`
    db.query(query, (err, result) => {
        console.log(result)
        if (err) {
            console.log(err)
            res.status(500).json({
                message: 'Error creating ticket',
                error: err,
                success: false,
            })
        } else {
            res.status(200).json({
                message: 'Ticket created successfully',
                success: true,
            })
        }
    })
}

module.exports = { CreateTicket }
