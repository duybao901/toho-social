import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import * as CALL_TYPES from '../../redux/constants/call'

// MUI
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: "400px",
        height: "450px",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: "5px",
        overflow: "hidden",
        display: 'flex',
        flexDirection: 'column',
        border: "none",
        outline: 'none'
    },
}));

function CallModal() {

    const dispatch = useDispatch();
    const { call, auth, socket } = useSelector(state => state);
    const classes = useStyles();

    const [mins, setMins] = useState(0);
    const [second, setSecond] = useState(0);
    const [total, setTotal] = useState(0);
    const [answer, setAnswer] = useState(false);

    // set time
    useEffect(() => {
        const setTime = () => {
            setTotal(t => t + 1);
            setTimeout(setTime, 1000);
        }
        setTime();
        return () => setTotal(0);
    }, [])

    useEffect(() => {
        setMins(total % 60);
        setSecond(parseInt(total / 60));
    }, [total])

    // Tự động ngắt kết nối nếu sau 15s không phản hồi answer
    useEffect(() => {
        if (answer) {
            setTotal(0)
        } else {
            var timeout = setTimeout(() => {
                dispatch({ type: CALL_TYPES.CALL, payload: null })
                setTotal(0)
                socket.emit("endCall", call);
            }, 15000)
        }
        return () => clearTimeout(timeout)
    }, [dispatch, answer])


    const handleClose = () => {
        dispatch({ type: CALL_TYPES.CALL, payload: null })
        setTotal(0)
        socket.emit("endCall", call);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={call !== null ? true : false}             
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={call !== null ? true : false}>
                    <div className={classes.paper}>
                        <div className="modal__heading editprofile__heading">
                            <div className='modal__heading-left'>
                                <h2>{call.fullname}</h2>
                            </div>
                            <div className='modal__heading-right'>
                                <div className="modal__heading-close" onClick={handleClose} style={{ marginRight: "0px" }}>
                                    <i className='bx bx-x'></i>
                                </div>
                            </div>
                        </div>
                        <div className="call__body">
                            <div className="call__content">
                                <img src={call.avatar} alt="call_avatar" className="call__avatar">
                                </img>
                                <span className="call__username">
                                    {call.username}
                                </span>

                                {
                                    answer ? <div className="call__time">
                                        <span>
                                            {second.toString().length < 2 ? '0' + second : second}
                                        </span>:
                                        <span>
                                            {mins.toString().length < 2 ? '0' + mins : mins}
                                        </span>
                                    </div> :
                                        <span style={{ fontSize: "1.4rem", marginBottom: "10px" }}>call {call.video ? "video..." : "audio..."}</span>
                                }
                                {
                                    !answer && <div className="call__time">
                                        <span>
                                            {second.toString().length < 2 ? '0' + second : second}
                                        </span>:
                                        <span>
                                            {mins.toString().length < 2 ? '0' + mins : mins}
                                        </span>
                                    </div>
                                }
                                <div className="call__control" style={{ justifyContent: !(call.recipient === auth.user._id && !answer) ? "center" : "space-between" }}>
                                    <div className="call__control-icon off" onClick={handleClose}>
                                        <i className='bx bxs-phone-off'></i>
                                    </div>
                                    {
                                        (call.recipient === auth.user._id && !answer) &&
                                        <>
                                            {
                                                !call.video ? <div className="call__control-icon answer" onClick={() => setAnswer(true)}>
                                                    <i className='bx bxs-phone' ></i>
                                                </div> : <div className="call__control-icon answer" onClick={() => setAnswer(true)}>
                                                    <i className='bx bxs-video'></i>
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default CallModal
