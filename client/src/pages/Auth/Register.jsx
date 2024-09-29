import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import styles from './Login.module.css';
import login from '../../assets/login.png'
import authServices from '../../services/authServices';
import { getErrorMessage } from '../../util/GetError';

const Register = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const data = {
                firstname,
                lastname,
                username,
                password
            }
            const response = await authServices.registerUser(data);
            console.log(response.data);
            setLoading(false);
            message.success(`You're Registered Successfully !`);
            navigate('/login');

        } catch (err) {
            console.log(err);
            message.error(getErrorMessage(err));
            setLoading(false)
        }
    }
    return (
        <div>
            <div className={styles.login_card}>
                <img src= {login} alt='..'/>
                <h2>Register</h2>
            <div className={styles.input_inline_wrapper}>
                <Input
                    placeholder='First Name'
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)} />

                <Input
                    placeholder='Last Name'
                    style={{marginLeft:'10px'}}
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)} />
            </div>

            <div className={styles.input_wrapper}>
                <Input
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />.
            </div>
            <div className={styles.input_wrapper}>
                <Input.Password
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className={styles.input_info}>
                Existing Uer ? <Link to="/login">Login</Link>
            </div>
                <Button loading = {loading} type='primary' size='large' disabled={!username || !password} onClick={handleSubmit}>Register</Button>
            </div>
        </div>
    )
}
export default Register;