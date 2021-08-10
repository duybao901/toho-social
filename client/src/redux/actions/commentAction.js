import * as POST_TYPES from '../constants/post'
import * as GLOBLE_TYPES from '../constants/index'
import { patchDataAPI, postDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from '../actions/notifyAction'

export const createComment = (post, newComment, auth, socket) => async dispatch => {
    let newPost = { ...post, comments: [...post.comments, newComment] }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost } })

    try {
        const res = await postDataAPI('comment',
            {
                ...newComment,
                postId: post._id,
                postUserId: post.user._id,
            },
            auth.token);
        const newData = { ...res.data.newComment, user: auth.user, postUserId: post.user._id }
        let newPost = { ...post, comments: [...post.comments, newData] }
        dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost } })
        socket.emit("createComment", newPost);

        const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? "mentioned you in a comment 💬." : "has commented on your post 💬.",
            recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
            url: `/post/${post._id}`,
            content: post.content,
            image: post.images[0].url
        }

        dispatch(createNotify({ msg, auth, socket }))
    } catch (error) {
        if (error) {
            return dispatch({
                type: GLOBLE_TYPES.NOTIFY,
                payload: {
                    err: error.response.data.msg
                }
            })
        }
    }
}

export const updateComment = (post, comment, content, auth, socket) => async dispatch => {
    const newComments = post.comments.map(item => {
        return item._id === comment._id ? { ...comment, content } : item
    })

    const newData = { ...post, comments: newComments }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost: newData } })

    try {
        await patchDataAPI(`comment/${comment._id}`, { content }, auth.token);
        socket.emit("updateComment", newData);
    } catch (error) {
        if (error) {
            return dispatch({
                type: GLOBLE_TYPES.NOTIFY,
                payload: {
                    err: error.response.data.msg
                }
            })
        }
    }

}

export const likeComment = (post, comment, auth, socket) => async dispatch => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };

    const newComments = post.comments.map(item => item._id === newComment._id ? newComment : item)

    const newData = { ...post, comments: newComments }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost: newData } })



    try {
        await patchDataAPI(`comment/${comment._id}/like`, null, auth.token);
        socket.emit("likeComment", newData);
    } catch (error) {
        if (error) {
            return dispatch({
                type: GLOBLE_TYPES.NOTIFY,
                payload: {
                    err: error.response.data.msg
                }
            })
        }
    }
}

export const unlikeComment = (post, comment, auth, socket) => async dispatch => {
    const newComment = { ...comment, likes: comment.likes.filter(item => item._id !== auth.user._id) };

    const newComments = post.comments.map(item => item._id === newComment._id ? newComment : item)

    const newData = { ...post, comments: newComments }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost: newData } })

    try {
        await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token);
        socket.emit("unlikeComment", newData);
    } catch (error) {
        if (error) {
            return dispatch({
                type: GLOBLE_TYPES.NOTIFY,
                payload: {
                    err: error.response.data.msg
                }
            })
        }
    }
}

export const removeComment = (post, comment, auth, socket) => async dispatch => {
    console.log(post.comments);
    const arrCmtDelete = [...post.comments.filter(cm => cm.reply === comment._id), comment];

    const newPost = {
        ...post,
        comments: post.comments.filter(cm => !arrCmtDelete.find(item => cm._id === item._id))
    }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost } })

    try {
        arrCmtDelete.forEach(item => {
            deleteDataAPI(`/comment/${item._id}`, auth.token);
            const msg = {
                id: item._id,              
                recipients: comment.reply ? [comment.tag._id] : [post.user._id],
                url: `/post/${post._id}`,
            }

            dispatch(removeNotify({ msg, auth, socket }))
        })
        socket.emit("removeComment", newPost);

       

    } catch (error) {
        if (error) {
            return dispatch({
                type: GLOBLE_TYPES.NOTIFY,
                payload: {
                    err: error.response.data.msg
                }
            })
        }
    }
}