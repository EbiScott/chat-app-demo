const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

var mongoose = require('mongoose')
require('dotenv').config();

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


const dbURI = process.env.MONGODB_URI


var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)


    message.save((err) => {
        if(err)
            sendStatus(500)

        Message.findOne({message: 'badword'}, (err, censored) => {
            if(censored){
                console.log('censored words found', censored)
                Message.remove({_id: censored.id}, (err) => {
                    console.log('removed censored message')
             } )}
        })

        io.emit('message', req.body)
        res.sendStatus(200)
    })

})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbURI, { useMongoClient: true }, (err) => {
    console.log('mongo db connection', err)
})


var server = http.listen(3000, () => {
    console.log('server is listening on port',  server.address().port)
})