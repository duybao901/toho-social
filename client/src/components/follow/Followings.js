import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FollowButton from '../FollowButton';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: "600px",
        height: "650px",
        borderRadius: "15px",
        padding: '2px',
        outline: 'none',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        overflow: 'hidden',
    },
}));

export default function Followings({ users, followings, setFollowings }) {
    const classes = useStyles();
    const { auth } = useSelector(state => state);
    const handleClose = () => {
        setFollowings(false);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={followings}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={followings}>
                    <div className={classes.paper}>
                        <div className="modal__heading editprofile__heading">
                            <div className='modal__heading-left'>
                                <h2>
                                    Followings
                                </h2>
                            </div>
                            <div className='modal__heading-right'>
                                <div className="modal__heading-close" onClick={handleClose}>
                                    <i className='bx bx-x'></i>
                                </div>
                            </div>
                        </div>
                        <div className='followers__body'>
                            {users.map((user, index) => {
                                return <div key={index} className='followers__user'>
                                    <Link to={`/profile/${user._id}`} onClick={() => setFollowings(false)}>
                                        <img className='followers__user-avatar' src={user.avatar} alt='useravatar'>
                                        </img>
                                        <div className="followers__user-infor">
                                            <div className='followers__user-infor-wraper'>
                                                <div>
                                                    <span className="followers__user-infor-fullname">{user.fullname}</span>
                                                    <span className="followers__user-infor-username">@{user.username}</span>
                                                </div>
                                            </div>
                                            <p className='followers__user-infor-bio'>
                                                {user.story}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="followers__user-follow">
                                        {user._id !== auth.user._id && <FollowButton user={user} />}
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}