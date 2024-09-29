import axios from 'axios';
const SERVER_URL = 'http://localhost:8080/api';

const registerUser = data => axios.post(`${SERVER_URL}/register`,data);
const loginUser = data => axios.post(`${SERVER_URL}/login`, data);

const authServices = {
    registerUser,
    loginUser
}

export default authServices;