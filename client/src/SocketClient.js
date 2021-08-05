import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as POST_TYPES from './redux/constants/post'
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

    return <> </>
}

export default SocketClient
