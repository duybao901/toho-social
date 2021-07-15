import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from './styles'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import CssTextField from '../../utils/cssTextField';
import { checkImage } from '../../utils/imageUpload'

import * as GLOBLE_TYPES from "../../redux/constants/index"
import { updateUserProfile } from '../../redux/actions/profileAction';

const useStyles = makeStyles(styles);

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

export default function EditProfile({ open, handleClose, users }) {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state);
    const classes = useStyles();
    const [userEdit, setUserEdit] = useState({ fullname: '', story: '', address: '', website: '', gender: '' })

    const { fullname, story, address, website, gender } = userEdit;

    function onHandleChange(e) {
        setUserEdit({
            ...userEdit,
            [e.target.name]: e.target.value
        })
    }
    function onHandleSubmit(e) {
        dispatch(updateUserProfile({ userData: userEdit, auth }));
    }

    const handleUploadAvatar = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const err = checkImage(file);
        if (err) {
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: err } })
        } else {
            let formData = new FormData();
            formData.append('file', file);
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true } })
            try {
                const res = await axios.post("/api/upload_image", formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    }
                })
                dispatch({
                    type: "SHOW_MEDIA",
                    payload: {
                        show: true,
                        imageURL: res.data.avatar.url,
                        imageId: res.data.avatar.public_id,
                        aspectX: 1,
                        edit_url: "change_avatar",
                        user: users[0],
                        body: "avatar",
                    }
                })
                dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: {} })
            } catch (error) {
                if (error) {
                    dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });
                }
            }
        }
    }

    const handleUploadBackground = async (e) => {
        const file = e.target.files[0];
        const err = checkImage(file);
        if (err) {
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: err } })
        } else {
            let formData = new FormData();
            formData.append('file', file);
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true } })
            try {
                const res = await axios.post("/api/upload_image", formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    }
                })
                dispatch({
                    type: "SHOW_MEDIA",
                    payload: {
                        show: true, imageURL: res.data.avatar.url,
                        imageId: res.data.avatar.public_id,
                        aspectX: 3,
                        edit_url: "change_background",
                        body: "background",
                    }
                })
                dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: {} })
            } catch (error) {
                if (error) {
                    dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });
                }
            }
        }
    }

    useEffect(() => {
        if (users.length > 0) {
            setUserEdit(users[0]);
        }
    }, [users])
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <div className="modal__heading editprofile__heading">
                            <div className='modal__heading-left'>
                                <div className="modal__heading-close" onClick={handleClose}>
                                    <i className='bx bx-x'></i>
                                </div>
                                <h2>
                                    Edit Profile
                                </h2>
                            </div>
                            <div className='modal__heading-right'>
                                <button className='modal__save-btn' onClick={onHandleSubmit}>
                                    Save
                                </button>
                            </div>
                        </div>

                        {users && users.map((user, index) => {
                            return <div className="modal__body" key={index}>
                                <div className='editprofile__background'>
                                    <div className="editprofile__upload-avatar">
                                        <div className="editprofile__upload-control">
                                            <input onChange={handleUploadBackground} type='file' id='upload-background' className="editprofile__upload"></input>
                                            <i className='bx bx-camera'></i>
                                        </div>
                                    </div>
                                    <img src={user && user.background} alt='userbackground'>
                                    </img>
                                </div>
                                <div className="editprofile__wrapper">
                                    <div className="editprofile__avatar">
                                        <div className="editprofile__upload-avatar">
                                            <div className="editprofile__upload-control">
                                                <input onChange={handleUploadAvatar} className="editprofile__upload" type='file' id='upload-avatar'></input>
                                                <i className='bx bx-camera'></i>
                                            </div>
                                        </div>
                                        <img src={user && user.avatar} alt='userbackground'>
                                        </img>
                                    </div>

                                    <div className="editprofile__form">
                                        <div className="editprofile__form-group">
                                            <div className="editprofile__form-input">
                                                <CssTextField
                                                    label="Full Name"
                                                    variant="outlined"
                                                    onChange={onHandleChange}
                                                    name='fullname'
                                                    value={fullname}
                                                    type="text"
                                                    required
                                                    fullWidth
                                                />
                                            </div>
                                            <span className='form__checklength'>
                                                {fullname.length}/50
                                            </span>
                                        </div>
                                        <div className="editprofile__form-group">
                                            <div className="editprofile__form-input">

                                                <CssTextField
                                                    variant="outlined"
                                                    type="text"
                                                    label="Bio"
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    name='story'
                                                    value={story}
                                                    onChange={onHandleChange}
                                                />
                                            </div>
                                            <span className='form__checklength'>
                                                {story.length}/160
                                            </span>
                                        </div>
                                        <div className="editprofile__form-group">
                                            <div className="editprofile__form-input">

                                                <CssTextField
                                                    label="Location"
                                                    variant="outlined"
                                                    onChange={onHandleChange}
                                                    name='address'
                                                    value={address}
                                                    type="text"
                                                    required
                                                    fullWidth
                                                />
                                            </div>
                                            <span className='form__checklength'>
                                                {address.length}/100
                                            </span>
                                        </div>
                                        <div className="editprofile__form-group">
                                            <div className="editprofile__form-input">
                                                <CssTextField
                                                    label="Website"
                                                    variant="outlined"
                                                    onChange={onHandleChange}
                                                    name='website'
                                                    value={website}
                                                    type="text"
                                                    required
                                                    fullWidth
                                                />
                                            </div>
                                            <span className='form__checklength'>
                                                {website.length}/80
                                            </span>
                                        </div>
                                        <FormControl style={{ marginBottom: '30px' }} component="fieldset">
                                            <RadioGroup aria-label="gender" name="gender" value={gender} onChange={onHandleChange}>
                                                <div className='register__form-gr'>
                                                    <FormControlLabel value="male" control={<GreenRadio />} label="Male" />
                                                    <FormControlLabel value="female" control={<GreenRadio />} label="Female" />
                                                    <FormControlLabel value="other" control={<GreenRadio />} label="Other" />
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
