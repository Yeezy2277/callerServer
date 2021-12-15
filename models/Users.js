const {Schema, model} = require('mongoose');

const Users = new Schema({
    phone: {type: String, unique: true, required: true},
    password: {type: String, required: false},
    code: {type: String, required: true},
})

module.exports = model('Users', Users);
