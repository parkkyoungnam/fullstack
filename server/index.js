const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const config = require('./config/key')

mongoose.connect(config.mongoURI, {
    

}).then(() => console.log('MongoDB Connected...' + config.mongoURI + process.env.NODE_ENV))
.catch(err => console.log(err));

const {User} = require('./models/User')
const {auth} = require('./Middleware/auth')

const cooKieParser = require('cookie-parser')

//const bodyParser = require('body-parser')
//application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended:true}));
//application/json
//app.use(bodyParser.json());
//바디 파서 없이 해보자. -> express에서 바디파서 제공
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//auth 인증 부분 에러로 인한 코드 추가
app.use(cooKieParser());






app.get('/', (req, res) => res.send('hello world!!!'))

app.get('/api/hello', (req, res) => {
    res.send("hello ~~~");
})

app.post('/register', (req, res) => {

    //회원 가입 할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    /*
        id : "hello",
        password : "123"
    */
    
    const user = new User(req.body)

    //save를 하기 전에 비밀번호를 암호화 해야한다.

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

app.post('/api/users/login', (req, res) => {

    console.log('로그인 시작');

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
            user.comparePassword(req.body.password , (err, isMatch) => {

                if(!isMatch)
                {
                    return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
                }
                
                // 비밀번호가 맞으면 토큰 생성.
                user.generateToken((err, user) => {

                    if(err)
                    {
                        return res.status(400).send(err);
                    }

                    console.log(user.token);

                    // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등등등.....
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess:true, userId:user._id})

                })
            })
        }
    })

    console.log('로그인이 성공되었습니다.')
})

app.get('/api/users/auth', auth, (req, res) => {

    //여기까지 미들웨어를 통과해 왔다는 뜻은 Authentication이 TRUE라는 말

    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.role,
        role : req.user.role,
        image : req.user.image
    })

})

app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate(
        {_id:req.user._id},
        {token:""},
        (err, user) => {
            if(err)
            {
                return res.json({success:false, err});
            }

            return res.status(200).send({
                success:true
            })
        })
})


app.listen(port, () => console.log(`example app listening on port ${port}`))
