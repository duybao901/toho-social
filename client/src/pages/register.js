import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import * as authActions from '../redux/actions/authAction'

const CssTextField = withStyles({
    root: {
        // position: 'relative',
        marginBottom: "5px",
        "&:last-child": {
            marginBottom: "10px",
        },
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

const GreenRadio = withStyles({
    root: {
        color: "#1DA1F2",
        '&$checked': {
            color: "#1DA1F2",
        },
    },
    checked: {
    },
})((props) => <Radio color="default" {...props} />);


function Register() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { errMsg } = useSelector(state => state.notify);
    const { auth } = useSelector(state => state);
    const [state, setState] = useState({ fullname: '', username: '', email: 'duy@gmail.com', password: '', cf_password: '', gender: 'male' });
    const { fullname, username, email, password, cf_password, gender } = state;


    function onHandleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        dispatch(authActions.register(state));
    }

    useEffect(() => {
        if (auth.token) {
            history.push('/');
        }
    }, [auth.token, history])
    return (
        <div className='register'>
            <div className='register__container'>
                <div className="register__left">
                    <img src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1627573258/toho/fy3jf6mv7nucunkgmjgj.jpg" alt='a'>
                    </img>
                </div>
                <div className="register__right">
                    <Link to='/'>
                        <img style={{ width: "50px", }} src="https://res.cloudinary.com/dxnfxl89q/image/upload/v1624525522/Toho/logo_t2dvwn.png" alt='a'></img>
                    </Link>
                    <h1 className="register__right-heading">Join Toho today.</h1>
                    {/* <h2 className="register__right-banner">Join Toho today.</h2> */}
                    <form onSubmit={onHandleSubmit} className='register__form'>
                        <CssTextField
                            label="Fullname"
                            variant="outlined"
                            onChange={onHandleChange}
                            name='fullname'
                            value={fullname}
                            type="text"
                            fullWidth
                            helperText={errMsg && errMsg.fullname ? errMsg.fullname : " "}
                        />
                        <CssTextField
                            label="Username"
                            variant="outlined"
                            onChange={onHandleChange}
                            name='username'
                            value={username}
                            type="text"
                            fullWidth
                            helperText={errMsg && errMsg.username ? errMsg.username : " "}

                        />
                        <CssTextField
                            label="Email"
                            variant="outlined"
                            onChange={onHandleChange}
                            name='email'
                            value={email}
                            type="email"
                            fullWidth
                            helperText={errMsg && errMsg.email ? errMsg.email : " "}
                        />
                        <CssTextField
                            label="Password"
                            variant="outlined"
                            onChange={onHandleChange}
                            name='password'
                            value={password}
                            type='password'
                            autoComplete={password}
                            fullWidth
                            helperText={errMsg && errMsg.password ? errMsg.password : " "}
                        />
                        <CssTextField
                            label="Confirm Password"
                            variant="outlined"
                            onChange={onHandleChange}
                            name='cf_password'
                            value={cf_password}
                            type='password'
                            autoComplete={cf_password}
                            fullWidth
                            helperText={errMsg && errMsg.cf_password ? errMsg.cf_password : " "}
                        />
                        <div className="register__gender-box">
                            <FormControl style={{ marginBottom: '10px' }} component="fieldset">
                                <RadioGroup aria-label="gender" name="gender" value={gender} onChange={onHandleChange}>
                                    <div className='register__form-gr'>
                                        <FormControlLabel value="male" control={<GreenRadio />} label="Male" />
                                        <FormControlLabel value="female" control={<GreenRadio />} label="Female" />
                                        <FormControlLabel value="other" control={<GreenRadio />} label="Other" />
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <Link to='/'>
                                Login now
                            </Link>
                        </div>
                        <button className='button__primary-ds active'>Register</button>
                    </form>
                </div>
            </div>
            <div className="register__bottom">
                <ul>
                    <li>
                        Introduce
                    </li>
                    <li>
                        Help Center
                    </li>
                    <li>
                        Terms of Service
                    </li>
                    <li>
                        Privacy Policy
                    </li>
                    <li>
                        Cookie Policy
                    </li>
                    <li>
                        Advertising information
                    </li>
                    <li>
                        Blog
                    </li>
                    <li>
                        Status
                    </li>
                    <li>
                        Job
                    </li>
                    <li>
                        Brand Resources
                    </li>
                    <li>
                        advertisement
                    </li>
                    <li>
                        Marketing
                    </li>
                </ul>
                <p>
                    © 2021 Toho, Inc.
                </p>
            </div>
        </div>
    )
}

export default Register
