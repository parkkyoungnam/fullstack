import axios from 'axios';

import {
    LOGIN_USER,
    REGISTER_USER
}from './types';

export function loginUser(dataTosubmit)
{
    const request = axios.post('/api/users/login', dataTosubmit)
    .then(response =>  response.data )

    return {
        type : LOGIN_USER,
        payload : request
    }
}

export function registerUser(dataToSubmit) {

    const request = axios.post('/register', dataToSubmit)
        .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}