import React from 'react';
import {Route,Routes} from 'react-router';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import TodoList from './pages/Todo/TodoList';
import './App.css';
//import Navbar from './components/Navbar';

const App = () => {
  return(
    <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element = {<Login/>} />
    <Route path="/register" element = {<Register />} />
    <Route path='/to-do-list' element = {<TodoList/>} />
    {/* <Route path='/navbar' element={<Navbar/>}/> */}
</Routes>
  )
}
export default App;