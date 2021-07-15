import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom';

import * as authActions from '../redux/actions/authAction'

import CssTextField from '../utils/cssTextField';

function Login() {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);
    const history = useHistory();
    const [state, setState] = useState({ email: 'duy@gmail.com', password: '' });
    const { email, password } = state;
    function onHandleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        dispatch(authActions.login({ email, password }))
    }

    useEffect(() => {
        if (auth.token) {
            history.push('/');
        }
    }, [auth.token, history])

    return (
        <div className="login">
            <div className="login__container">
                <img src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1624525522/Toho/logo_t2dvwn.png" alt='a' />
                <h1>Log in to Toho Social.</h1>
                <form onSubmit={onHandleSubmit} className='login__form'>
                    <CssTextField
                        label="Email"
                        variant="outlined"
                        onChange={onHandleChange}
                        name='email'
                        value={email}
                        type="email"
                        required
                    />
                    <CssTextField
                        label="Password"
                        variant="outlined"
                        onChange={onHandleChange}
                        name='password'
                        value={password}
                        type='password'
                        autoComplete={password}
                        required
                    />
                    <button disabled={email && password ? false : true} className={email && password ? 'button__primary-ds active' : 'button__primary-ds'}>Login</button>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ cursor: 'pointer', color: "#1DA1F2", fontSize: '15px' }}>Forgot password?</p>
                        <p style={{ cursor: 'pointer', color: "#1DA1F2", fontSize: '15px' }}><Link to='/register'>Register now</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
