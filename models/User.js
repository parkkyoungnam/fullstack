const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name : {
        type : String,
        maxlength : 50
    },

    email : {
        type : String,
        trim : true,
        unique:1
        // pkn 0813@naver.com -> 빈칸이 있을 경우 빈칸 없애줌
    },

    password : {
        type : String,
        minlength : 5
    },

    lastname : {
        type : String,
        maxlength : 50
    },
    
    role : {
        type : Number,
        default : 0
    },

    image : String,

    token : {
        type : String
    },

    toeknExp : {
        type : Number
    }

})

const User = mongoose.model('User', userSchema)

module.exports = {User}