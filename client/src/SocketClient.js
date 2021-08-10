import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as POST_TYPES from './redux/constants/post'
import * as GLOBLE_TYPES from './redux/constants/index'
import * as NOTIFY_TYPES from './redux/constants/notifycation'

function spawnNotification(body, icon, url, title) {
    var options = {
        body: body,
        icon: icon
    }
    var notification = new Notification(title, options);
    console.log(notification)
    notification.onclick = e => {
        e.preventDefault();
        window.open(url, "_blank")
    }
}



function SocketClient() {
    const dispatch = useDispatch();
    const { auth, socket } = useSelector(state => state);

    useEffect(() => {
        socket.emit('joinUser', auth.user._id);
    }, [socket, auth.user._id])

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
    }, [socket, dispatch])


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

    return <> </>
}

export default SocketClient
