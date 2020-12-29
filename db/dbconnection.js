const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const url = 'mongodb+srv://Olga:Real_Chat_App_12345@cluster0.ee3ts.mongodb.net/Cluster0?retryWrites=true&w=majority';
const connect = mongoose.connect(url, { useNewUrlParser: true });
module.exports = connect;