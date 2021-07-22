import * as POST_TYPES from '../constants/post'
import * as GLOBLE_TYPES from '../constants/index'
import { patchDataAPI, postDataAPI } from '../../utils/fetchData'

export const createComment = (post, newComnent, auth) => async dispatch => {
    let newPost = { ...post, comments: [...post.comments, newComnent] }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost } })

    try {
        const res = await postDataAPI('comment', { ...newComnent, postId: post._id }, auth.token);
        const newData = { ...res.data.newComment, user: auth.user }
        let newPost = { ...post, comments: [...post.comments, newData] }
        dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost } })

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

export const updateComment = (post, comment, content, auth) => async dispatch => {
    const newComments = post.comments.map(item => {
        return item._id === comment._id ? { ...comment, content } : item
    })

    const newData = { ...post, comments: newComments }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost: newData } })

    try {
        await patchDataAPI(`comment/${comment._id}`, { content }, auth.token);
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

export const likeComment = (post, comment, auth) => async dispatch => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };

    const newComments = post.comments.map(item => item._id === newComment._id ? newComment : item)

    const newData = { ...post, comments: newComments }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost: newData } })

    try {
        await patchDataAPI(`comment/${comment._id}/like`, null, auth.token);
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

export const unlikeComment = (post, comment, auth) => async dispatch => {
    const newComment = { ...comment, likes: comment.likes.filter(item => item._id !== auth.user._id) };

    const newComments = post.comments.map(item => item._id === newComment._id ? newComment : item)

    const newData = { ...post, comments: newComments }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: { newPost: newData } })

    try {
        await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token);

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