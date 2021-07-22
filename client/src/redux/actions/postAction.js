import * as GLOBLE_TYPES from '../constants/index';
import * as POST_TYPES from '../constants/post';
import { imagesUpload } from '../../utils/imageUpload';
import { postDataAPI, getDataAPI, patchDataAPI } from '../../utils/fetchData';

export const createPost = ({ content, images, auth }) => async dispatch => {
    let media = [];
    try {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true, } });
        if (images.length > 0) media = await imagesUpload(images);

        const res = await postDataAPI('create_post',
            { content, images: media }, auth.token
        );


        dispatch({
            type: POST_TYPES.CREATE_POST,
            payload: { newPost: { ...res.data.newPost, user: auth.user } },
        })

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

export const getPosts = ({ auth }) => async dispatch => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })

        const res = await getDataAPI('posts', auth.token);
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

export const likePost = ({ post, auth }) => async dispatch => {
    let newPost = {};
    newPost = { ...post, likes: [...post.likes, auth.user] }
    dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: { newPost },
    })

    try {
        patchDataAPI(`post/${post._id}/like`, null, auth.token);
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

export const unlikePost = ({ post, auth }) => async dispatch => {
    let newPost = {};
    newPost = { ...post, likes: post.likes.filter(like => like._id !== auth.user._id) }
    dispatch({
        type: POST_TYPES.UPDATE_POST,
        payload: { newPost },
    })

    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, auth.token);
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