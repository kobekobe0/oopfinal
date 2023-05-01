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
} = require('./crud/projects.controller')
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

//this will contain mysql retrieval code
//crud operations