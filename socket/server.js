const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const port = process.env.PORT || 3001

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })

    // Handle other events here
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
