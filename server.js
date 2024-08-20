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

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.log('MongoDB connection error:', err));

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

// app.post('/messages', (req, res) => {
//     var message = new Message(req.body);

//     message.save((err) => {
//         if (err) return res.sendStatus(500);

//         Message.findOne({ message: 'badword' }, (err, censored) => {
//             if (censored) {
//                 console.log('Censored words found', censored);
//                 Message.deleteOne({ _id: censored.id }, (err) => {
//                     console.log('Removed censored message');
//                 });
//             }
//         });

//         io.emit('message', req.body);
//         res.sendStatus(200);
//     });
// });
app.post('/messages', async (req, res) => {
    try {
        const message = new Message({ name: req.body.name, message: req.body.message });
        await message.save();
        io.emit('message', req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log('Error saving message:', err);
        res.sendStatus(500);
    }
});


const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected to application');
});

server.listen(3000, () => {
    console.log('Server is listening on port', server.address().port);
});
