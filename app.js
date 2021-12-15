const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const process = require('process');
const dotenv = require('dotenv');
const authRouter = require('./authRouter');

dotenv.config();

const port = '3000'

const app = express();

app.use(express.json());
app.use('/api', authRouter);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://vitalya:ABk0BzXGLZEbVo2K@cluster0.fgvor.mongodb.net/users?retryWrites=true&w=majority');
        app.listen(port, () => console.log('server started'));
    } catch(e) {
        console.log(e);
    }
}

start();
