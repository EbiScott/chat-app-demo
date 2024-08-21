const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.Promise = Promise;

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.log('MongoDB connection error:', err));

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// Updated GET /messages route using async/await
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.send(messages);
    } catch (err) {
        console.log('Error fetching messages:', err);
        res.sendStatus(500);
    }
});

// Updated POST /messages route using async/await
app.post('/messages', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        console.log('Saved to db');

        const censored = await Message.findOne({ message: 'badword' });
        if (censored) {
            await Message.deleteOne({ _id: censored.id });
            console.log('Removed censored message');
        } else {
            io.emit('message', req.body);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error saving message:', error);
        res.sendStatus(500);
    } finally {
        console.log('Message post called');
    }
});

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected to the application');
});

server.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
});
