require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
var nodemailer = require('nodemailer');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect(`mongodb+srv://admin-varshith:${process.env.PASSWORD}@cluster0.6tucv.mongodb.net/UsersDB`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const userSchema = {
    username: String,
    mail: String,
    exprience: Number,
    query: String
};

const User = new mongoose.model('User', userSchema)

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res){

    const user = new User({
        username: req.body.username,
        mail: req.body.mail,
        exprience: req.body.exprience,
        query: req.body.query
    });

    user.save();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.EMAIL,
        to: req.body.mail,
        subject: 'thanks for ur intrest',
        text: `your response has been recorded for your query : ${req.body.query}`
    };
    
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        }else{
            console.log('Email sent : '+info.response);
        }
    })

    res.send('<h1> Your response has been recorded</h1>');
    
});




app.listen(process.env.PORT || 3000, function(){
    console.log("server started at port 3000");
});