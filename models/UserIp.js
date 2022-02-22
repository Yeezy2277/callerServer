const {Schema, model} = require('mongoose');

const UserIp = new Schema({
    ip: {type: String, unique: false, required: false}
})

module.exports = model('UserIp', UserIp);
