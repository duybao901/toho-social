import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"
import * as CALL_TYPES from '../../redux/constants/call'

// MUI
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { addMessage } from '../../redux/actions/messageAction'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: "400px",
        minHeight: "450px",
        maxHeight: "850px",
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
    const { call, auth, socket, peer } = useSelector(state => state);
    const classes = useStyles();

    const [mins, setMins] = useState(0);
    const [second, setSecond] = useState(0);
    const [hour, setHour] = useState(0);

    const [total, setTotal] = useState(0);
    const [answer, setAnswer] = useState(false);
    const [tracks, setTracks] = useState(null);
    const [newCall, setNewCall] = useState(null)

    const youVideo = useRef();
    const ortherVideo = useRef();

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
        setHour(parseInt(total / 3600));

    }, [total])

    const addCallMessage = useCallback(({ call, times }) => {
        if (call.recipient !== auth.user._id) {
            const msg = {
                sender: call.sender,
                recipient: call.recipient,
                text: '',
                media: [],
                call: {
                    video: call.video,
                    times,
                },
                createdAt: new Date().toISOString(),
            }
            dispatch(addMessage({ msg, auth, socket }));
        }

    }, [auth, dispatch, socket])

    // Tự động ngắt kết nối nếu sau 15s không phản hồi answer
    useEffect(() => {
        if (answer) {
            setTotal(0)
        } else {
            var timeout = setTimeout(() => {
                dispatch({ type: CALL_TYPES.CALL, payload: null })
                addCallMessage({ call, times: 0 })
                if (newCall) newCall.close();
                socket.emit("endCall", { ...call, times: 0 });
                setTotal(0)
            }, 15000)
        }
        return () => clearTimeout(timeout)
    }, [dispatch, answer, socket, call, tracks, addCallMessage])



    // End Call
    useEffect(() => {
        socket.on("endCallToClient", data => {
            tracks && tracks.forEach(track => { track.stop(); })
            if (newCall) newCall.close();
            addCallMessage({ call, times: data.times })
            dispatch({ type: CALL_TYPES.CALL, payload: null })
        });
        return () => {
            socket.off("endCallToClient");
        }
    }, [socket, dispatch, tracks, addCallMessage, call, newCall])

    // Caller Disconnect
    useEffect(() => {
        socket.on("callerDisconnect", data => {
            tracks && tracks.forEach(track => {
                track.stop();
            })
            let times = answer ? total : 0
            addCallMessage(call, times)

            dispatch({ type: CALL_TYPES.CALL, payload: null })
        });
        return () => {
            socket.off("callerDisconnect");
        }
    }, [socket, dispatch, tracks, addCallMessage, answer, call, total])

    // End stream
    const handleClose = () => {

        let times = answer ? total : 0
        addCallMessage({ call, times })

        if (newCall) newCall.close();

        tracks && tracks.forEach(track => { track.stop(); })
        dispatch({ type: CALL_TYPES.CALL, payload: null })
        setTotal(0)

        socket.emit("endCall", { ...call, times });
    };

    const openStream = (video) => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const config = { audio: true, video }
            return navigator.mediaDevices.getUserMedia(config)
        }
    }

    const playStream = (tag, stream) => {
        let video = tag;
        video.srcObject = stream;
        video && video.play();
    }

    // Đối phương ok video call
    const handleAnswer = () => {
        openStream(call.video).then(stream => {
            playStream(youVideo.current, stream)
            const track = stream.getTracks()
            setTracks(track)

            const newCall = peer.call(call.peer_id, stream);
            newCall.on('stream', function (remoteStream) {
                playStream(ortherVideo.current, remoteStream)
            });
            setAnswer(true)
            setNewCall(newCall)
        })
    }

    // Đối phương ok video call -> Bắt đầu call                                      
    useEffect(() => {
        peer.on('call', newCall => {
            openStream(call.video).then(stream => {

                if (youVideo.current) {
                    playStream(youVideo.current, stream);
                }

                const track = stream.getTracks();
                setTracks(track);

                newCall.answer(stream); // Answer the call with an A/V stream.

                newCall.on('stream', function (remoteStream) {
                    if (ortherVideo.current) {
                        playStream(ortherVideo.current, remoteStream)
                    }
                });

                setAnswer(true);
            })
        })
        return () => peer.removeListener('call')
    }, [peer, call.video, tracks])

    const styleModal = {
        opacity: answer && call.video ? 0 : 1,
        outline: answer && call.video ? 'none' : 1,
    }

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
                    <div>
                        <div className={classes.paper} style={styleModal}>
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
                            <div className="call__body"

                            >
                                <div className="call__content">
                                    <img src={call.avatar} alt="call_avatar" className="call__avatar">
                                    </img>
                                    <span className="call__username">
                                        {call.username}
                                    </span>

                                    {
                                        !answer ? <div className="call__time">
                                            <span>
                                                {hour.toString().length < 2 ? '0' + hour : hour}
                                            </span>:
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
                                        answer && <div className="call__time">
                                            <span>
                                                {hour.toString().length < 2 ? '0' + hour : hour}
                                            </span>:
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
                                                    !call.video ? <div className="call__control-icon answer" onClick={handleAnswer}>
                                                        <i className='bx bxs-phone' ></i>
                                                    </div> : <div className="call__control-icon answer" onClick={handleAnswer}>
                                                        <i className='bx bxs-video'></i>
                                                    </div>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call Video */}
                        <div className="show_video"
                            style={{ opacity: answer && call.video ? 1 : 0 }}
                        >
                            <video className="you_video" ref={youVideo}></video>
                            <video className="orther_video" ref={ortherVideo}></video>
                        </div>
                        <div className="call_infor-control"
                            style={{ opacity: answer && call.video ? 1 : 0 }}
                        >
                            <div className="call__time">
                                <span>
                                    {second.toString().length < 2 ? '0' + second : second}
                                </span>:
                                <span>
                                    {mins.toString().length < 2 ? '0' + mins : mins}
                                </span>
                            </div>
                            <div className="call__control-icon off" onClick={handleClose}>
                                <i className='bx bxs-phone' ></i>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal >
        </div >
    )
}

export default CallModal
