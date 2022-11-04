const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10
const myPlaintextPassword = 's0/\/\P4$$w0rD'
const someOtherPlaintextPassword = 'not_bacon'
const jwt = require('jsonwebtoken')

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

    tokenExp : {
        type : Number
    }
})

userSchema.pre('save', function(next) {
    
    var user = this

    if(user.isModified('password'))
    {
        console.log('비밀번호가 암호화 됩니다.')
        //비밀번호를 암호화 시키자
        bcrypt.genSalt(saltRounds, function(err, salt) {
                
            if(err)
            {
                return next(err)
            }

            bcrypt.hash(user.password, salt, function(err, hash) {
                
                if(err)
                {
                    return next(err)
                }

                user.password = hash
                //index.js에서의 save로 보내준다.
                next()

            });
        });
    }
    else
    {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err)
        {
            return cb(err)
        }

        cb(null, isMatch)
        
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;
    //jsonwebtoken 사용
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err)
        {
            return cb(err)
        }

        cb(null, user)
    })

}


userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에,
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id":decoded, "token":token}, function(err, user)
        {
            if(err)
            {
                return cb(err)
            }
            else
            {
                cb(null, user)
            }
        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports = {User}