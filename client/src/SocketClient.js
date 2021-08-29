import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as POST_TYPES from './redux/constants/post'
import * as GLOBLE_TYPES from './redux/constants/index'
import * as NOTIFY_TYPES from './redux/constants/notifycation'
import * as MESSAGE_TYPES from './redux/constants/message'
import * as ONLINE_TYPES from './redux/constants/online'
import * as CALL_TYPES from './redux/constants/call'

import SoundNotification from './audio/sound_notify.mp3'

function spawnNotification(body, icon, url, title) {

    var options = {
        body: body,
        icon: icon
    }
    var notification = new Notification(title, options);

    notification.onclick = e => {
        e.preventDefault();
        window.open(url, "_blank")
    }
}



function SocketClient() {
    const dispatch = useDispatch();
    const { auth, socket, notification, online, call } = useSelector(state => state);

    const audioRef = useRef();

    useEffect(() => {
        socket.emit('joinUser', auth.user);
    }, [socket, auth.user])

    // Like post
    useEffect(() => {
        socket.on("likeToClient", newPost => {
            dispatch({
                type: POST_TYPES.UPDATE_POST,
                payload: { newPost },
            })
        })
        return () => {
            socket.off("likeToClient");
        }
    }, [socket, dispatch])

    // UnLike post
    useEffect(() => {
        socket.on("unlikeToClient", newPost => {
            dispatch({
                type: POST_TYPES.UPDATE_POST,
                payload: { newPost },
            })
        })
        return () => {
            socket.off("unlikeToClient");
        }
    }, [socket, dispatch])

    // Create Comment
    useEffect(() => {
        socket.on("createCommentToClient", newPost => {
            dispatch({
                type: POST_TYPES.UPDATE_POST,
                payload: { newPost },
            })
        })
        return () => {
            socket.off("createCommentToClient");
        }
    }, [socket, dispatch])

    // Remove Comment
    useEffect(() => {
        socket.on("removeCommentToClient", newPost => {
            dispatch({
                type: POST_TYPES.UPDATE_POST,
                payload: { newPost },
            })
        })
        return () => {
            socket.off("removeCommentToClient");
        }
    }, [socket, dispatch])

    // Like Comment
    useEffect(() => {
        socket.on("likeCommentToClient", newPost => {
            dispatch({
                type: POST_TYPES.UPDATE_POST,
                payload: { newPost },
            })
        })
        return () => {
            socket.off("likeCommentToClient");
        }
    }, [socket, dispatch])

    // unLike Comment
    useEffect(() => {
        socket.on("unlikeCommentToClient", newPost => {
            dispatch({
                type: POST_TYPES.UPDATE_POST,
                payload: { newPost },
            })
        })
        return () => {
            socket.off("unlikeCommentToClient");
        }
    }, [socket, dispatch])

    // Update Comment
    useEffect(() => {
        socket.on("updateCommentToClient", newPost => {
            dispatch({
                type: POST_TYPES.UPDATE_POST,
                payload: { newPost },
            })
        })
        return () => {
            socket.off("updateCommentToClient");
        }
    }, [socket, dispatch])

    // Follow User
    useEffect(() => {
        socket.on("followUserToClient", newUser => {
            dispatch({
                type: GLOBLE_TYPES.AUTH,
                payload: {
                    token: auth.token,
                    user: newUser
                }
            })
        })
        return () => {
            socket.off("followUserToClient");
        }
    }, [socket, dispatch, auth.token])

    // Follow User
    useEffect(() => {
        socket.on("unfollowUserToClient", newUser => {
            dispatch({
                type: GLOBLE_TYPES.AUTH,
                payload: {
                    token: auth.token,
                    user: newUser
                }
            })
        })
        return () => {
            socket.off("unfollowUserToClient");
        }
    }, [socket, dispatch, auth.token])

    // Create Notify
    useEffect(() => {
        socket.on("createNotifyToClient", msg => {
            if (notification.sound) audioRef.current.play();

            spawnNotification(
                msg.user.username + ' ' + msg.text,
                msg.user.avatar,
                msg.url,
                'Toho-network'
            )

            dispatch({
                type: NOTIFY_TYPES.CREATE_NOTIFICATION,
                payload: msg
            })
        })
        return () => {
            socket.off("createNotifyToClient");
        }
    }, [socket, dispatch, notification.sound])

    // Create Notify
    useEffect(() => {
        socket.on("removeNotifyToClient", msg => {
            dispatch({
                type: NOTIFY_TYPES.REMOVE_NOTIFICATION,
                payload: msg
            })
        })
        return () => {
            socket.off("removeNotifyToClient");
        }
    }, [socket, dispatch])

    // Message
    useEffect(() => {
        socket.on("addMessageToClient", msg => {
            dispatch({
                type: MESSAGE_TYPES.ADD_MESSAGE,
                payload: msg
            })
            dispatch({
                type: MESSAGE_TYPES.ADD_USER,
                payload: {
                    ...msg.user,
                    text: msg.text,
                    media: msg.media,
                    call: msg.call
                }
            })
        })
        return () => {
            socket.off("addMessageToClient");
        }
    }, [socket, dispatch])

    // Check user online & offline
    useEffect(() => {
        socket.emit("checkUserOnline", auth.user);
    }, [socket, auth.user])

    // Gửi cho mình tín hiệu của những thằng mà mình dang follow nó mà nó đang online
    useEffect(() => {
        socket.on('checkUserOnlineToMe', data => {
            data.forEach(item => {
                if (!online.data.includes(item.id)) {
                    dispatch({ type: ONLINE_TYPES.ONLINE, payload: item.id })
                }
            })
        })
        return () => {
            socket.off("checkUserOnlineToMe");
        }
    }, [socket, auth.user, online.data, dispatch])

    // Gửi đến những thằng mà đang follow mình tín hiệu mình đang online
    useEffect(() => {
        socket.on("checkUserOnlineToClient", id => {
            if (!online.data.includes(id)) {
                dispatch({ type: ONLINE_TYPES.ONLINE, payload: id })
            }
        });
        return () => {
            socket.off("checkUserOnlineToClient");
        }
    }, [socket, auth.user, online.data, dispatch])

    // User Offline
    useEffect(() => {
        socket.on("checkUserOffLine", id => {
            dispatch({ type: ONLINE_TYPES.OFFLINE, payload: id })
        });
        return () => {
            socket.off("checkUserOffLine");
        }
    }, [socket, auth.user, dispatch])


    // Call
    useEffect(() => {
        socket.on("callUserToClient", data => {
            dispatch({ type: CALL_TYPES.CALL, payload: data })
        });
        return () => {
            socket.off("callUserToClient");
        }
    }, [socket, dispatch])

    // Call Busy
    useEffect(() => {
        socket.on("userBusy", data => {
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: `${call.username} is busy!` } })
        });
        return () => {
            socket.off("userBusy");
        }
    }, [socket, dispatch, call])

    return <>
        <audio style={{ display: 'none' }} controls ref={audioRef}>
            <source src={SoundNotification} type="audio/mp3"></source>
        </audio>
    </>
}

export default SocketClient
