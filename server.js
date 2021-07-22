require('dotenv').config();
const cors = require('cors');
const cookiePasrer = require('cookie-parser');

const fileUpload = require('express-fileupload')
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Middleware 
app.use(cors());
app.use(express.json());
app.use(cookiePasrer());
app.use(fileUpload({
    useTempFiles: true
}))

// Router
app.use('/api', require('./Router/user.route'));
app.use('/api', require('./Router/upload.router'));
app.use('/api', require('./Router/post.router'));
app.use('/api', require('./Router/comment.router'));


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

app.get('', (req, res) => {
    return res.json({ msg: "Hello world 🐊" });
})

app.listen(port, () => {
    console.log('Applistening on port ', port);
})