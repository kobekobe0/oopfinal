const mysql = require('mysql')

//projects
//project_members

const CreateProject = async (req, res, next) => {
    //kapag gumawa project, magiging admin yung creator
    //then gumawa ng project_members entry
    const { name, description, userId } = req.body
    try {
        //create the project
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'bug_tracker',
            multipleStatements: true,
        })

        connection.connect((err) => {
            if (err) throw err
        })

        //after insert, i need to query the last inserted id
        // then store that id in a variable

        const createProjectPromise = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `INSERT INTO projects (name, description, creator) VALUES('${name}', '${description}', ${userId});
                     SELECT id, creator FROM projects WHERE id = LAST_INSERT_ID();`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results[1]) //return the creator id (RowDataPacket)
                        connection.end()
                    }
                )
            })
        }

        //then return the id and use it to create the project_members entry
        // let projectId

        createProjectPromise().then((results) => {
            req.creator = results[0]
            return next()
        })

        //create the project_members entry
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const CreateProjectMembersCreator = async (req, res) => {
    const { id, creator } = req.creator
    try {
        console.log(id, creator)
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'bug_tracker',
            multipleStatements: true,
        })

        connection.connect((err) => {
            if (err) throw err
        })

        const createProjectMemberCreatorPromise = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `INSERT INTO project_members (project_id, member_id, role) VALUES(${id}, ${creator}, 'ADMIN');
                     SELECT * FROM project_members WHERE id = LAST_INSERT_ID();`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results) //return the creator id (RowDataPacket)
                        connection.end()
                    }
                )
            })
        }

        createProjectMemberCreatorPromise()
            .then((results) => {
                console.log(results)
                return res.status(201).json({
                    message: 'Project created successfully',
                    success: true,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    } catch (err) {}
}

const CheckIfUserInProject = async (req, res, next) => {
    const { projectId, assigneeId } = req.body
    try {
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'bug_tracker',
            multipleStatements: true,
        })

        connection.connect((err) => {
            if (err) throw err
        })

        const checkIfExists = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `SELECT * FROM project_members WHERE project_id = ${projectId} AND member_id = ${assigneeId}`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results)
                        connection.end()
                    }
                )
            })
        }
        checkIfExists().then((results) => {
            console.log(results)
            if (results.length > 0) {
                console.log('User is already in the project')
                res.status(500).json({
                    message: 'User is already in the project',
                    success: false,
                })
            } else {
                return next()
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const CheckIfProjectAdmin = async (req, res, next) => {
    //req = projectId, userId
    //query project_members using projectId and userId, return the role
    //if admin, next()
    //req.myObject = projectId, assigneeId, role [ADMIN or MEMBER]
    //else, return error
    const { projectId, userId } = req.body
    try {
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'bug_tracker',
            multipleStatements: true,
        })

        connection.connect((err) => {
            if (err) throw err
        })

        const checkRole = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `SELECT * FROM project_members WHERE project_id = ${projectId} AND member_id = ${userId}`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results[0])
                        connection.end()
                    }
                )
            })
        }

        checkRole().then((results) => {
            if (results.role == 'ADMIN') {
                req.myObject = {
                    projectId,
                }
                return next()
            } else {
                res.status(401).json({
                    message:
                        'Unauthorized. You are not an admin in this project',
                })
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const CreateProjectMember = async (req, res) => {
    const { assigneeId, role } = req.body
    const { projectId } = req.myObject
    try {
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'admin123',
            database: 'bug_tracker',
            multipleStatements: true,
        })

        connection.connect((err) => {
            if (err) throw err
        })

        const createProjectMemberPromise = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `INSERT INTO project_members (project_id, member_id, role) VALUES(${projectId}, ${assigneeId}, '${role}');
                     SELECT * FROM project_members WHERE id = LAST_INSERT_ID();`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results[0])
                        connection.end()
                    }
                )
            })
        }
        createProjectMemberPromise()
            .then((results) => {
                console.log(results)
                if (results.affectedRows > 0) {
                    res.status(201).json({
                        message: 'Project member created successfully',
                        success: true,
                        member: results,
                    })
                } else {
                    res.status(500).json({
                        message: 'User is already in the project',
                        success: false,
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    CreateProject,
    CreateProjectMembersCreator,
    CheckIfProjectAdmin,
    CreateProjectMember,
    CheckIfUserInProject,
}
