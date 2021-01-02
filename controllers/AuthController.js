const User = require('../models/UserReg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const setting = require('../config/setting')
const multer = require('multer');


const register = (req, res, next) => {
    bcrypt.hash(req.body.password ,10 , async (err, hashedPwd) => {
        if (err) {
            res.json({
                status: false,
                message: "Error while registering", err
            })
        }

        if (!req.file || !req.body.name || !req.body.contactNo || !req.body.email || !hashedPwd) {
            res.json({
                status: false,
                message: "Some Fields are unfilled"
            })
        }
        // New User
        let newUser = new User({
            name: req.body.name,
            contactNo: req.body.contactNo,
            email: req.body.email,
            password: hashedPwd,
            image: req.file.path,
            isAdmin: false
        })

        try {
            let userCheck = await User.findOne({ email: req.body.email });
            if (userCheck) {
                res.json({
                    status: false,
                    message: "Email id is already registered"
                })
            } else {
                newUser.save().then(user => {
                    res.json({
                     status: true,
                message: "User Registered"
            })
        }).catch(err => {
            res.json({
                status: false,
                message: "Error while registering. Try again", err
            })
        })
            }
        } catch (err) {
            res.json({
                status: false,
                message: "Error while registering. Try again", err
            })
        }
    })
}

const login = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({ $or: [{ email: username }] }).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.json({
                        status: false,
                        error: "Some Mistake in password" + err
                    })
                }
                if (result) {
                    let token = jwt.sign({ name: user.name }, setting.secret, { expiresIn: '24h' });
                    res.json({
                        status: true,
                        message: "logged in",
                        token: token,
                        user: user
                    })
                } else {
                    res.json({
                        status: false,
                        message: "Password Does not match",
                    })
                }
            })
        } else {
            res.json({
                status: false,
                message: "no user found"
            })
        }
    })
}



module.exports ={ register, login };