const express = require('express')
const { CreateUser, LoginUser } = require('./crud/users.controller')
const bodyParser = require('body-parser')
const cors = require('cors')
const {
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
} = require('./crud/projects.controller')
const {
    CreateTicket,
    DeleteTicket,
    AssignTicket,
    UpdateTicket,
    OwnTicket,
    GetUserTicketsByProject,
    GetTicketsByProject,
} = require('./crud/tickets.controller')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

app.post('/signup', CreateUser)
app.post('/login', LoginUser)
app.post('/create-project', CreateProject, CreateProjectMembersCreator)
app.post(
    '/add-member',
    CheckIfUserInProject,
    CheckIfProjectAdmin,
    CreateProjectMember
)
app.post(
    '/change-role',
    CheckIfUserMember,
    CheckIfProjectAdmin,
    ChangeMemberRole
)

app.delete(
    '/remove-member',
    CheckIfUserMember,
    CheckIfProjectAdmin,
    RemoveMember
)

//----Tickets----//
app.post('/create-ticket', CheckIfProjectAdmin, CreateTicket)
app.delete('/delete-ticket', CheckIfProjectAdmin, DeleteTicket)
app.post('/assign-ticket', CheckIfUserMember, AssignTicket)

app.post('/update-ticket', UpdateTicket)
app.post('/own-ticket', OwnTicket)

//this will contain mysql retrieval code

//------TICKETS-------//
app.get('/get-user-tickets', GetUserTicketsByProject)
app.get('/get-project-tickets', GetTicketsByProject)

//--------PROJECTS--------//
app.get('/get-project-members', GetProjectMembers)
app.get('/get-user-projects', GetUserProjectTemp, GetUserProjects)
//crud operations
