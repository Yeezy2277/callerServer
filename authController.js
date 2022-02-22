const User = require('./models/User');
const TokenUser = require('./models/TokenUser');
const UserProfile = require('./models/UserProfile');
const UserIp = require('./models/UserIp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {secret} = require('./config');

const generateAccessToken = id => {
    const payload = {id};
    return jwt.sign(payload, secret, {expiresIn: "100000h"});
}

async function getAccessVoximplant(user) {
    try {
        const Vemail = "vital.popov.04@gmail.com";
        const Vpassword = "Vitalik123-";

        //fetch response from voximplantto get API key and Account ID
        const responseM = await fetch(
            "https://api.voximplant.com/platform_api/Logon/?account_email=" +
            Vemail +
            "&account_password=" +
            Vpassword
        );
        const jsonM = await responseM.json();
        const api_key = jsonM.api_key;
        const account_id = JSON.stringify(jsonM.account_id);
        const response = await fetch(
            "https://api.voximplant.com/platform_api/AddUser/?account_id=" +
            account_id +
            "&api_key=" +
            api_key +
            "&user_name=" +
            user.phone +
            "&user_display_name=" +
            user.phone +
            "&user_password=gh85962h7d6h27d6d6" +
            "&application_id=10570134"
        );
        const json = await response.json();
        const user_id = JSON.stringify(json.user_id);
        user.accountId = account_id;
        user.apiKey = api_key;
        user.userId = user_id;
        user.save();
    } catch(e) {
        res.status(400).json({message: 'Не удалось получить доступ к sdk'})
    }
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
            console.log(phone, code);
            const userData = await User.findOne({phone});
            let userProfile = await UserProfile.findOne({phone});
            !userProfile ? userProfile = await new UserProfile({phone, language: "Русский", sex: "Мужской", birthday: "", age: "18-24", isIncome: true}) : null;
            const validateCode = code === userData.code;
            if (!validateCode) {
                res.status(400).json({message: "Неверный код"});
            }
            else {
                let password = Math.random().toString(36).slice(-8);
                userData.code = code;
                userData.password === '' ? userData.password = password : null;
                await userData.save();
                const token = generateAccessToken(userData._id);
                let usersToken = await TokenUser.findOne({phone});
                console.log(usersToken);
                !usersToken ? usersToken = await new TokenUser({token, phone}) : usersToken.token = token;
                await usersToken.save();
                await userProfile.save();
                console.log('userdata');
                console.log(userData);
                await getAccessVoximplant(userData);
                return res.json({token, accountId: userData.accountId, password: userData.password === '' ? password : userData.password});
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
	    console.log(req.body);
            const token = req.headers.authorization.split(' ')[1]
            const userToken = await TokenUser.findOne({token});
            const userProfile = await UserProfile.findOne({phone: userToken.phone});
            userProfile.language = language;
            userProfile.sex = sex;
            userProfile.birthday = birthday;
            userProfile.age = age;
            userProfile.userType = userType;
            await userProfile.save();
            return res.json(userProfile);
        } catch(e) {
            console.log(req.body);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }
async getUserProfile(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const userProfile = await UserProfile.findOne({token});
            return res.json(userProfile);
        } catch(e) {
            console.log(req.body);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }
async getIpAddress(req, res) {
        try {
            const ip = req.ip;
            const userIp = new UserIp({ip});
            await userIp.save();
            return res.json(ip);
        } catch(e) {
            console.log(req.body);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }

    async users(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            let userToken = await TokenUser.findOne({token});
            const phone = userToken.phone;
            console.log(userToken);
            const {language, sex, age, userType} = req.body;
            const userProfile = await UserProfile.find({language, age, sex, userType, isIncome: true});
            const user = userProfile.map(item => {
             return item.phone === phone ? null : {phone: item.phone}
})
           const userWithoutNumber = user.filter(i => i !== null);
            return res.json(userWithoutNumber);
        } catch(e) {
            console.log(e);
            console.log(req.body);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }
    async getIncomingState(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const userProfile = await UserProfile.findOne({token});
            return res.json(userProfile);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }
    async setIncomingState(req, res) {
        try {
            const {isIncoming} = req.body;
            const token = req.headers.authorization.split(' ')[1]
            const userToken = await TokenUser.findOne({token});
            let userProfile = await UserProfile.findOne({phone: userToken.phone});
            userProfile.isIncome = isIncoming;
            userProfile.save();
            return res.json(userProfile);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: "Произошла ошибка"});
        }
    }
}

module.exports = new authController();
