const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const config = require('./config/key')
mongoose.connect(config.mongoURI, {

}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));



const {User} = require('./models/User')
const bodyParser = require('body-parser')
//application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended:true}));
//application/json
//app.use(bodyParser.json());
//바디 파서 없이 해보자. -> express에서 바디파서 제공
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req, res) => res.send('hello world!!!'))


app.post('/register', (req, res) => {

    //회원 가입 할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    /*
        id : "hello",
        password : "123"
    */
    
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err)
        {
            console.log('에러 발생 테스트');
            return res.json({success: false, err})
        }
        console.log('성공 발생 테스트');
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {

    // 요청된 이메일을 데이터베이스에 있는지 찾는다.
    User.findOne({email : req.body.email}, (err, user) => {
        if(!user)
        {
            return res.json({
                loginSuccess: false,
                message:"제공된 이메일에 해당 유저가 존재하지 않습니다."
            })
        }
        else
        {
            // 이메일이 존재한다면 비밀번호가 같은지 체크.
            
        }
    })
    
    // 비밀번호가 맞으면 토큰 생성.

})

app.listen(port, () => console.log(`example app listening on port ${port}`))


