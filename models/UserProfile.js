const {Schema, model} = require('mongoose');

const UserProfile = new Schema({
    phone: {type: String, unique: false, required: false},
    language: {type: String, required: false},
    sex: {type: String, required: false},
    birthday: {type: String, required: false},
    age: {type: String, required: false},
    userType: {type: String, required: false},
})

module.exports = model('UserProfile', UserProfile);
