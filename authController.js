const User = require('./models/User');
const TokenUser = require('./models/TokenUser');
const UserProfile = require('./models/UserProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {secret} = require('./config');

const generateAccessToken = id => {
    const payload = {id};
    return jwt.sign(payload, secret, {expiresIn: "100000h"});
}

async function sendCode(phone) {
    try {
        let code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        await fetch(`https://sms.ru/sms/send?api_id=FB412B41-6433-7038-95E1-780FE0F5FAC1&to=${phone}&msg=${code}&json=1`);
        return code;
    } catch(e) {
        console.log(e);
    }
}

class authController {
    async login(req,res) {
        try {
            const {phone, code} = req.body;
            const userData = await User.findOne({phone});
            let userProfile = await UserProfile.findOne({phone});
            userProfile ? userProfile = await new UserProfile({phone, language: "Русский", sex: "Мужской", birthday: "", age: "18-24"}) : null;
            const validateCode = code === userData.code;
            if (!validateCode) {
                res.status(400).json({message: "Неверный код"});
            }
            else {
                let password = Math.random().toString(36).slice(-8);
                const hashPassword = bcrypt.hashSync(password, 7);
                userData.code = code;
                userData.password === '' ? userData.password = hashPassword : null;
                await userData.save();
                const token = generateAccessToken(userData._id);
                let usersToken = await TokenUser.findOne({phone});
                !usersToken ? usersToken = await new TokenUser({token, phone}) : null;
                await usersToken.save();
                await userProfile.save();
                return res.json({token});
            }
        } catch(e) {
            console.log(e);
            res.status(400).json({message: "Ошибка входа"});
        }
    }

    async code(req,res) {
        try {
            const {phone} = req.body;
            const candidate = await User.findOne({phone});
            if (candidate) {
                candidate.code = await sendCode(phone);
                await candidate.save();
                return res.json({message: "Код отправлен"});
            } else {
                const code = await sendCode(phone);
                const user = new User({phone, code});
                await user.save();
                return res.json({message: "Код отправлен"});
            }
        } catch(e) {
            console.log(e);
            res.status(400).json({message: "Не удалось отправить код"});
        }
    }
    async userProfile(req, res) {
        try {
            const {language, sex, birthday, age, userType} = req.body;
            const token = req.headers.authorization.split(' ')[1]
            const userProfile = await UserProfile.findOne({token});
            userProfile.language = language;
            userProfile.sex = sex;
            userProfile.birthday = birthday;
            userProfile.age = age;
            userProfile.userType = userType;
            await userProfile.save();
            return res.json(userProfile);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }
    async users(req, res) {
        try {
            const {language, sex, birthday, age, userType} = req.body;
            const userProfile = await UserProfile.find({language, age, userType});
            return res.json(userProfile);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }
}

module.exports = new authController();
