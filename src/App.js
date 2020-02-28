const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const port = 8085;

mongoose.connect('mongodb+srv://<username>:<password>123@<db>.mongodb.net/<schema>?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const routes = require('./routes.js');

const server = express();

server.use(express.static(__dirname + '/../public'));
server.use(cors());
server.use(cookieParser());
server.use(express.json());
server.use(routes);

console.log('Server run on port: ' + port)
server.listen(port);
