const mysql = require('mysql')

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'bug_tracker',
    multipleStatements: true,
})

//------FOR ADMINS------//
//call CheckIfUserAdmin first before calling these
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
    try {
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
    } catch (error) {
        console.log(error)
        res.status(501).json({
            message: error?.message,
            success: false,
        })
    }
}

//delete ticket
const DeleteTicket = async (req, res) => {
    const { userId, ticketId } = req.body
    try {
        const query = `DELETE FROM tickets WHERE id = ${ticketId}`
        db.query(query, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Error deleting ticket',
                    error: err,
                    success: false,
                })
            } else {
                console.log(result)
                res.status(200).json({
                    message: 'Ticket deleted successfully',
                    success: true,
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            message: error?.message,
            success: false,
        })
    }
}
//assign ticket

//------ALL MEMBERS------//
//own ticket
//update ticket // for changing its status
const UpdateTicket = async (req, res) => {
    const { userId, ticketId, status } = req.body
    try {
        const query = `UPDATE tickets SET status = ${status} WHERE id = ${ticketId}`
        db.query(query, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Error assigning ticket',
                    error: err,
                    success: false,
                })
            } else {
                console.log(result)
                res.status(200).json({
                    message: 'Ticket assigned successfully',
                    success: true,
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            message: error?.message,
            success: false,
        })
    }
}

module.exports = { CreateTicket, DeleteTicket }
