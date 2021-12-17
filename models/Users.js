const {Schema, model} = require('mongoose');

const Users = new Schema({
    phone: {type: String, unique: true, required: true},
    password: {type: String, required: false},
    code: {type: String, required: true},
    accountId: {type: String, required: false},
    apiKey: {type: String, required: false},
    userId: {type: String, required: false},
})

module.exports = model('Users', Users);
