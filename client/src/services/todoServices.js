import axios from 'axios';
import { getUserDetails } from '../util/GetUser';
const SERVER_URL = 'http://localhost:8080/api/todo';

const authHeaders = () => {
    let userToken = getUserDetails()?.token;
    if(!userToken){
        console.log("User Token is not available");
        return {};
    };
    return {
        headers:{'Authorization':`Bearer ${userToken}`}
    };
};

const createTodo = data => axios.post(`${SERVER_URL}/create-todo`,data,authHeaders());

const getAllTodos = userId => axios.get(`${SERVER_URL}/get-all-todos/${userId}`,authHeaders());

const deleteTodo = id => axios.post(`${SERVER_URL}/delete-todo/${id}`,{},authHeaders());

const updateTodo = (id,data)=> axios.post(`${SERVER_URL}/update-todo/${id}`,data,authHeaders());

const todoServices = {
    createTodo,
    getAllTodos,
    deleteTodo,
    updateTodo
}
export default todoServices;

