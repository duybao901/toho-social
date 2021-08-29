require('dotenv').config();
const cors = require('cors');
const cookiePasrer = require('cookie-parser');

const fileUpload = require('express-fileupload')
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const socketSever = require('./socketSever');
const { ExpressPeerServer } = require('peer');

// Middleware 
app.use(cors());
app.use(express.json());
app.use(cookiePasrer());
app.use(fileUpload({
    useTempFiles: true
}))

// Socket
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

io.on("connection", (socket) => {
    socketSever(socket);
});

// Create Peer Sever
const peerServer = ExpressPeerServer(httpServer, {
    path: '/'
});

app.use('/peerjs', peerServer);

// Router
app.use('/api', require('./Router/user.route'));
app.use('/api', require('./Router/upload.router'));
app.use('/api', require('./Router/post.router'));
app.use('/api', require('./Router/comment.router'));
app.use('/api', require('./Router/notify.router'));
app.use('/api', require('./Router/message.router'));

// Connect mongoodb
const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,

}, (err) => {
    if (err) throw err;
    console.log('Connected to mongodb')
})


const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
    console.log('Applistening on port ', port);
})