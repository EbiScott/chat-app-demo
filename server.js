const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection successful'))
.catch((err) => console.log('MongoDB connection error:', err));

const Message = mongoose.model('Chatting', {
    name: String,
    message: String
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        if (err) return res.sendStatus(500);
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    const message = new Message(req.body);

    message.save((err) => {
        if (err) return res.sendStatus(500);

        io.emit('message', req.body);
        res.sendStatus(200);
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

const server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
});
