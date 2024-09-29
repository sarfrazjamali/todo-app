import React, {useState}from 'react';
import styles from './Login.module.css';
import login from '../../assets/login.png';
import {Button,Input, message} from 'antd';
import { Link,useNavigate } from 'react-router-dom';
import authServices from '../../services/authServices';
import { getErrorMessage } from '../../util/GetError';


const Login = () => {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errorMessage,setErrorMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async() => {
        try{
            setLoading(true);
            const data = {
                username,
                password
            }
            const response = await authServices.loginUser(data);
            console.log(response.data);
            localStorage.setItem('toDoAppUser',JSON.stringify(response.data));
            message.success('Logged in Successfully')
            navigate('/to-do-list');
            setLoading(false);
            
        }catch(error){
            if(error.response && error.response.status === 404){
                setErrorMessage("Invalid username or password !")
                setLoading(false);
            }else{
             message.error(getErrorMessage(error));
            setLoading(false);  

            }
            // console.log(err);
            // message.error(getErrorMessage(err));
            // setLoading(false);  
        }
    }
    return(
        <div>
            <div className={styles.login_card}>
                <img src={login} alt='..'/>
                <h2>Login</h2>
                <div className={styles.input_wrapper}>
                    <Input
                    placeholder='Username'
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)} />
                </div>
                <div className={styles.input_wrapper}>
                    <Input.Password
                    placeholder='Password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)} />
                </div>
                <div className={styles.input_info}>
                    New User? <Link to="/register">Register</Link>
                </div>
                <Button loading={loading} type='primary' size='large' disabled={!username || !password} onClick={handleSubmit}>Login</Button>
                {errorMessage && <p style={{color:'red'}}>{errorMessage}</p>}
            </div>
        </div>
    )
}
export default Login;