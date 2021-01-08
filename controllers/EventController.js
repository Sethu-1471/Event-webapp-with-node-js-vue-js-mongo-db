const upload = require("../multer/storage");
const Event = require('../models/Event')
const User = require('../models/UserReg');
const fs = require("fs");
const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
    try {
        let testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'yolanda.hoeger@ethereal.email',
                    pass: 'SWMtnsa9Grdz1Hd3SQ'
                }
            });

            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: "rpsethu1471@gmail.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

        console.log("Message sent: %s", info.messageId);
        res.json({
            status: true,
            message: "Message sent:" + info.messageId
        });

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const savePost = async (req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } else {
        upload(req, res, async (err) => {
            if(req.file == null || req.file == undefined || req.file == ""){
                res.json({
                    status: false,
                    message: "No image set"
                });
            }else{
                if (err) {
                    res.json({
                        status: false,
                        message: err.message
                    });
                } else {
                    let event = new Event({
                        name: req.body.name,
                        desc: req.body.desc,
                        image: req.file.filename,
                        start: req.body.start,
                        end: req.body.end,
                        mode: req.body.mode,
                        public: req.body.public,
                        tags: req.body.tags,
                        modelink: req.body.modelink ,
                        createdBy: await User.findById({ _id: req.body.admin }),
                        registration: req.body.registration
                    });
                    await event.save(()=>{
                        if (err) res.json({
                            status: false,
                            message: err.message
                        });
                        res.json({
                            status: true,
                            message: "event hosted"
                        });
                    });
                }
            }
        });
    }
}

const updatePost = async (req, res) => {
    console.log(req.body.tags)
    var token = await getToken(req.headers);
    if (!token) {
        res.json({ status: false, message: 'Unauthorized.' });
    } else {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.postId));
        let event = await Event.find({ _id: id });
        if (event[0].createdBy._id != req.user._id.toString()) {
            res.json({
                status: false,
                message: "couldnt Update. Unauthorized user"
            });
        } else {
        try {
            if (req.query.withImage) {
                //image changed
                let $filePath = "./postuploads/" + req.query.orginalImage
                await fs.unlinkSync($filePath, (err) => {
                    if (err) {
                        res.json({
                            status: false,
                            message: "couldnt delete " + req.params.id + " image"
                        });
                    }
                })
                
                upload(req, res, async (err) => {
                    if (req.file == null || req.file == undefined || req.file == "") {
                        res.json({
                            status: false,
                            message: "No image set"
                        });
                    } else {
                        if (err) {
                            res.json({
                                status: false,
                                message: err.message
                            });
                        } else {
                            let event = {
                                name: req.body.name,
                                desc: req.body.desc,
                                image: req.file.filename,
                                start: req.body.start,
                                end: req.body.end,
                                mode: req.body.mode,
                                public: req.body.public,
                                tags: req.body.tags,
                                registration: req.body.registration,
                                modelink: req.body.modelink
                            }
                            var mongoose = require('mongoose');
                            var id = mongoose.Types.ObjectId((req.query.postId));
                            await Event.findOneAndUpdate({ _id: id }, event, {
                                new: true,
                                runValidators: true,
                            }).then(response => {
                                res.json({
                                    status: true,
                                    message: "Event Updated"
                                });
                            }).catch(err => {
                                res.json({
                                    status: false,
                                    message: err.message
                                });
                            })
                        }
                    }
                });
                
            
            } else {
                //image un-changed
                var mongoose = require('mongoose');
                var id = mongoose.Types.ObjectId((req.query.postId));
                await Event.findOneAndUpdate({ _id: id }, req.body, {
                    new: true,
                    runValidators: true,
                }).then(response => {
                    res.json({
                        status: true,
                        message: "Event Updated"
                    });
                }).catch(err => {
                    res.json({
                        status: false,
                        message: err.message
                    });
                })
            }
        } catch (err) {
            res.json({
                status: false,
                message: err.message
            });
        }
    }
    }
}

const deletePost = async (req, res) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    }
    try {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.postId));
        let event = await Event.find({ _id: id });
        if (event[0].createdBy._id != req.user._id.toString()) {
            res.json({
                status: false,
                message: "couldnt Delete. Unauthorized user"
            });
        } else {
            await Event.deleteOne({ _id: id }).then(resp => {
                let $filePath = "./postuploads/" + req.query.image
                fs.unlinkSync($filePath)
            })
        res.json({
            status: true,
            message: "Event deleted"
        });
        }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const getPostByPublic = async(req, res) => {
    try {
        let events = await Event.find({ public: true });
        res.json({
            status: true,
            events: events
        });
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const getPostByUserId = async (req, res) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    }
    try {
        let events = await Event.find({ "createdBy._id": req.user._id });
        let rEvents = await User.findById({ _id: req.user._id }).populate("myRegistration")
        res.json({
            status: true,
            myEvents: events.length > 0 ? events : null,
            registeredEvents: rEvents.myRegistration.length > 0 ? rEvents.myRegistration : null
        });
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const getsudoEvent = async (req, res) => {
    try {
        console.log(req.user);
        var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } else {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.postId));
        let event = await Event.findOne({ _id: id }).populate("participants.user")
        res.json({
            status: true,
            event: event
        });
    }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}

const getPostByPostId = async(req, res) => {
    try {
        let event = await Event.find({ _id: req.query.postId });
        if (event[0].public) {
            res.json({
                status: true,
                event: event[0]
            });   
        } else {
            console.log(req.user);
            if (event[0].createdBy._id == req.query.userId.toString()) {
                res.json({
                    status: true,
                    event: event[0]
                }); 
            } else {
                res.json({
                    status: false,
                    message: "Event is not published. Contact owner."
                });
            }
        }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}


const attendEvent = async (req, res) => {
    try {
        var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } else {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.postId));
        const event = await Event.findOne({
            _id: id
        })
        if (event) {
            let e = {
                user: req.user._id
            }
            await Event.findOneAndUpdate({_id: id},
                { $push: { "participants": e} }
            )   
            await User.findOneAndUpdate({_id: req.user._id},
                { $push: { myRegistration: id} }
            )  

            res.json({
                status: true,
                message: "You Registered for this event",
            });

        } else {
            res.json({
                status: false,
                message: "No Event Found"
            });
        }
    }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}


const unattendEvent = async (req, res) => {
    try {
        var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } else {
        var mongoose = require('mongoose');
        var id = mongoose.Types.ObjectId((req.query.postId));
        const event = await Event.findOne({
            _id: id
        })
        if (event) {
            await Event.findOneAndUpdate({_id: id},
                { $pull: { "participants": { user: req.user._id }} }
            )   
            await User.findOneAndUpdate({_id: req.user._id},
                { $pull: { myRegistration: id} }
            )  

            res.json({
                status: true,
                message: "You Unregistered for this event",
            });

        } else {
            res.json({
                status: false,
                message: "No Event Found"
            });
        }
    }
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
}


const getToken = (headers) => {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
};
  
module.exports = { savePost, sendMail, updatePost, attendEvent, unattendEvent, getsudoEvent, deletePost, getPostByPublic, getPostByUserId, getPostByPostId }