import * as GLOBLE_TYPES from '../constants/index';
import * as POST_TYPES from '../constants/post';
import * as AUTH_TYPES from '../constants/index';
import { imagesUpload } from '../../utils/imageUpload';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { createNotify, removeNotify } from '../actions/notifyAction'

export const createPost = ({ content, images, auth, socket }) => async dispatch => {
    let media = [];
    try {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true, } });
        if (images.length > 0) media = await imagesUpload(images);

        const res = await postDataAPI('create_post',
            { content, images: media }, auth.token
        );

        dispatch({
            type: POST_TYPES.CREATE_POST,
            payload: { newPost: { ...res.data.newPost, user: auth.user }, },
        })
        const msg = {
            id: res.data.newPost._id,
            text: "added a new post .",
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
            content,
            image: media[0].url,
        }

        dispatch(createNotify({ msg, auth, socket }))

        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: {} });


    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })
    }
}

export const getPosts = (token) => async dispatch => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })

        const res = await getDataAPI('posts', token);
        dispatch({ type: POST_TYPES.GET_POSTS, payload: res.data })

        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })

    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })
    }
}

export const updatePost = ({ content, images, auth, status }) => async dispatch => {
    let media = [];
    let imgNewUrl = images.filter(img => !img.url);
    let imgOldUrl = images.filter(img => img.url);
    if (status.content === content
        && imgNewUrl.length === 0
        && imgOldUrl.length === status.images.length
    ) return;
    try {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true, } });
        if (images.length > 0) media = await imagesUpload(imgNewUrl);

        const res = await patchDataAPI(`post/${status._id}`,
            { content, images: [...imgOldUrl, ...media] }, auth.token
        );

        dispatch({
            type: POST_TYPES.UPDATE_POST,
            payload: { newPost: { ...res.data.newPost, content, images: [...imgOldUrl, ...media], user: auth.user, comments: status.comments } },
        })

        dispatch({ type: POST_TYPES.STATUS, payload: { onEdit: false } });

        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: {} });


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

export const likePost = ({ post, auth, socket }) => async dispatch => {
    let newPost = {};
    newPost = { ...post, likes: [...post.likes, auth.user] }

    dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: { newPost },
    })

    try {
        await patchDataAPI(`post/${post._id}/like`, null, auth.token);
        socket.emit("likePost", newPost);

        const msg = {
            id: newPost._id,
            text: "like your post ❤️.",
            recipients: [newPost.user._id],
            url: `/post/${newPost._id}`,
            content: newPost.content,
            image: newPost.images[0].url,
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

export const unlikePost = ({ post, auth, socket }) => async dispatch => {
    let newPost = {};
    newPost = { ...post, likes: post.likes.filter(like => like._id !== auth.user._id) }

    dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: { newPost },
    })

    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, auth.token);
        socket.emit("unlikePost", newPost);

        const msg = {
            id: newPost._id,
            text: "❤️ like your post .",
            recipients: [newPost.user._id],
            url: `/post/${newPost._id}`,
        }

        dispatch(removeNotify({ msg, auth, socket }))

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

export const getDetailPost = (detailPost, id, auth) => async dispatch => {
    if (detailPost.every(post => post && post._id !== id)) {
        try {
            const res = await getDataAPI(`/post/${id}`, auth.token)
            dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
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
}

export const deletePost = (postId, auth, socket) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.DELETE_POST, payload: postId })

        const res = await deleteDataAPI(`/post/${postId}`, auth.token)
        const msg = {
            id: res.data.newPost._id,
            text: "added a new post.",
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
        }

        dispatch(removeNotify({ msg, auth, socket }))

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

export const savePost = (post, auth) => async (dispatch) => {
    const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] }
    dispatch({ type: AUTH_TYPES.AUTH, payload: { ...auth, user: newUser } })

    try {
        await patchDataAPI(`/post/${post._id}/save`, null, auth.token)
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

export const unsavePost = (post, auth) => async (dispatch) => {
    const newUser = { ...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: AUTH_TYPES.AUTH, payload: { ...auth, user: newUser } })

    try {
        await patchDataAPI(`/post/${post._id}/unsave`, null, auth.token)
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