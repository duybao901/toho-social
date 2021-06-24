import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import * as authActions from '../redux/actions/authAction'

const CssTextField = withStyles({
    root: {
        marginBottom: "20px",

        '& label': {
            fontSize: '16px',
            background: "#fff",
            padding: "0px 5px",
            "&.Mui-focused": {
                color: '#1DA1F2',
                background: "#fff",
                padding: "0px 5px",
            }
        },
        '& input': {
            fontSize: '16px',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#1DA1F2',
                borderWidth: "3px",
            },
        },
    },
})(TextField);

function Login() {
    const dispatch = useDispatch();

    const [state, setState] = useState({ email: 'duy@gmail.com', password: '', success: '', err: '', loading: false });
    const { email, password, success, err, loading } = state;
    function onHandleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value,
            success: '',
            err: '',
            loading: false
        })
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        dispatch(authActions.login({ email, password }))
    }

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
                    <button className='button__primary-ds'>Login</button>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ cursor: 'pointer', color: "#1DA1F2", fontSize: '15px' }}>Forgot password?</p>
                        <p style={{ cursor: 'pointer', color: "#1DA1F2", fontSize: '15px' }}>Register here.</p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
