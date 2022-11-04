import { Axios } from 'axios'
//import { response } from 'express'
import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import {loginUser } from '../../../_action/user_action'
import { useNavigate } from 'react-router-dom'



function LoginPage () {

  let navigate = useNavigate();

  const dispatch = useDispatch();
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")


  const onEmailHandler = (event) =>
  {
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) =>
  {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => 
  {
    event.preventDefault();
    //이걸 안하면 리프레시가 됨
    console.log(Email + ' ' + Password);
    

    //서버에 보낼 떄에는 axios 사용

    let body = 
    {
        email : Email,
        password : Password
    }

    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess)
        {
            //props.history.push('/')
            navigate('/home');
        }
        else
        {
          alert('에러가 발생하였습니다.');
        }
      })
  }

  return (
    <div style={{
      display:'flex', justifyContent: 'center', alignItems: 'center',
      width : '100%', height : '100vh'}}>
      
      

      <form style={{display:'flex', flexDirection:'column'}}
      onSubmit = {onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange = {onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange = {onPasswordHandler} />
        <br/>
        <button>
          Login
        </button>
      </form>
      </div>
  )
}

export default LoginPage