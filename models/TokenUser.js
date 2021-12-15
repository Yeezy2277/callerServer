const {Schema, model} = require('mongoose');

const TokenUser = new Schema({
    token: {type: String, unique: true, required: true},
    phone: {type: String, required: true},
})

module.exports = model('TokenUser', TokenUser);
