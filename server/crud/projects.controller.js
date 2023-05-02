const mysql = require('mysql')
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'bug_tracker',
    multipleStatements: true,
})

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

//--------ADDING MEMBERS TO PROJECTS--------//
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
            if (results?.role == 'ADMIN') {
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

                res.status(201).json({
                    message: 'Project member created successfully',
                    success: true,
                    member: results,
                })
            })
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })
    } catch (err) {
        console.log(err)
    }
}

//----------MAKING A MEMBER AN ADMIN----------//
// projectId, assigneeId, role, userId
//check if user in project
const CheckIfUserMember = async (req, res, next) => {
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
                return next()
            } else {
                console.log('User is not in the project')
                res.status(500).json({
                    message: 'User is not in the project',
                    success: false,
                })
            }
        })
    } catch (err) {
        console.log(err)
    }
}
//call CheckIfUserAdmin first before this
const ChangeMemberRole = async (req, res) => {
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

        const changeRole = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `UPDATE project_members SET role = '${role}' WHERE project_id = ${projectId} AND member_id = ${assigneeId};`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results)
                        connection.end()
                    }
                )
            })
        }

        changeRole().then((results) => {
            console.log(results)
            if (results.changedRows > 0) {
                res.status(200).json({
                    message: 'Member role changed successfully',
                    success: true,
                })
            } else {
                //FIX - not working
                res.status(500).json({
                    message: `User is already a ${role} in the project`,
                    success: false,
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

//----------DELETING A MEMBER----------//
//only admin can delete a member
//projectId, assigneeId, userId
//check if user in project
//call CheckIfUserMember first before this
//then call if user is admin
const RemoveMember = async (req, res) => {
    const { assigneeId } = req.body
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

        const removeMember = () => {
            return new Promise((resolve, reject) => {
                connection.query(
                    `DELETE FROM project_members WHERE project_id = ${projectId} AND member_id = ${assigneeId};`,
                    (err, results, fields) => {
                        if (err) reject(err)
                        resolve(results)
                        connection.end()
                    }
                )
            })
        }

        removeMember().then((results) => {
            console.log(results)
            if (results.affectedRows > 0) {
                res.status(200).json({
                    message: 'Member removed successfully',
                    success: true,
                })
            } else {
                res.status(500).json({
                    message: 'User is not in the project',
                    success: false,
                })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const GetProjectMembers = async (req, res) => {
    const { projectId } = req.body
    try {
        const query = `SELECT * FROM project_members WHERE project_id = ${projectId};`
        db.query(query, (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: err.message })
            }
            res.status(200).json({
                message: 'Members fetched successfully',
                members: results,
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

//The next TWO middleware will be called the same time
const GetUserProjectTemp = async (req, res, next) => {
    const { userId } = req.body
    try {
        const query = `SELECT project_id FROM project_members WHERE member_id = ${userId};`
        db.query(query, (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: err.message })
            }
            //store results as array not individual object
            req.myObject = { projectIds: results }
            next()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
const GetUserProjects = async (req, res) => {
    const { projectIds, userId } = req.myObject
    let projectId = []
    const convertToArray = () => {
        return new Promise((resolve, reject) => {
            projectIds.forEach((project) => {
                projectId.push(project.project_id)
            })
            resolve()
        })
    }
    await convertToArray()
    let projectIdArr = projectId.join(',')
    //console.log(projectIdArr)
    try {
        const query = `SELECT * FROM projects WHERE id IN (${projectIdArr});`
        db.query(query, (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: err.message })
            }
            console.log(results)
            res.status(200).json({
                message: 'Projects fetched successfully',
                projects: results,
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    CreateProject,
    CreateProjectMembersCreator,
    CheckIfProjectAdmin,
    CreateProjectMember,
    CheckIfUserInProject,
    CheckIfUserMember,
    ChangeMemberRole,
    RemoveMember,
    GetProjectMembers,
    GetUserProjectTemp,
    GetUserProjects,
}
