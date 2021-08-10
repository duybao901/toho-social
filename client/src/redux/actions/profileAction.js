import * as PROFILE_TYPES from '../constants/profile'
import * as GLOBLE_TYPES from '../constants/index'
import { getDataAPI, putDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from '../../redux/actions/notifyAction'

export const getProfileUser = ({ id, auth }) => async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id })
    try {
        dispatch({ type: PROFILE_TYPES.LOADING, payload: true })

        const res = await getDataAPI(`/user/${id}`, auth.token);

        const res1 = await getDataAPI(`/user_posts/${id}?limit=4`, auth.token)

        const users = await res;
        const posts = await res1;

        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: users.data
        })

        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: { ...posts.data, _id: id, page: 2, stopScroll: false }
        })


        dispatch({ type: PROFILE_TYPES.LOADING, payload: false })

    } catch (err) {
        if (err) {
            dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: err.response.data.msg } })
        }
    }

}

export const updateUserProfile = ({ userData, auth }) => async (dispatch) => {
    if (!userData.fullname) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Please add your fullname." } });
    }

    if (userData.fullname.length > 50) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Fullname so long." } });
    }

    if (userData.story.length > 160) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Bio so long." } });
    }

    if (userData.address.length > 100) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Location so long." } });
    }

    if (userData.website.length > 80) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Website so long." } });
    }

    try {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true } });

        const res = await putDataAPI('edit_profile', { ...userData }, auth.token);

        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { success: res.data.msg } });

        dispatch({
            type: GLOBLE_TYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user,
                    ...userData,
                }
            }
        })
    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });
    }
}

export const follow = ({ users, user, auth, socket }) => async (dispatch) => {
    var newUser;
    if (users.every(item => item._id !== user._id)) {
        newUser = { ...user, followers: [...user.followers, auth.user] }
    } else {
        users.forEach(item => {
            if (item._id === user._id) {
                newUser = { ...item, followers: [...item.followers, auth.user] }
            }
        })
    }

    dispatch({
        type: PROFILE_TYPES.FOLLOW,
        payload: newUser
    })

    dispatch({
        type: GLOBLE_TYPES.AUTH,
        payload: {
            ...auth,
            user: {
                ...auth.user,
                followings: [
                    ...auth.user.followings,
                    newUser
                ]
            }
        }
    })


    try {
        const res = await putDataAPI(`/${user._id}/follow`, null, auth.token);
        socket.emit("followUser", res.data.newUser);

        const msg = {
            id: auth.user._id,
            text: "has started to follow you 🍀.",
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });
    }
}

export const unfollow = ({ user, auth, socket }) => async (dispatch) => {
    const newUser = { ...user, followers: user.followers.filter(user => user._id !== auth.user._id) };

    dispatch({
        type: PROFILE_TYPES.UNFOLLOW,
        payload: newUser
    })

    dispatch({
        type: GLOBLE_TYPES.AUTH,
        payload: {
            ...auth,
            user: {
                ...auth.user,
                followings: auth.user.followings.filter(user => user._id !== newUser._id)
            }
        }
    })

    try {
        const res = await putDataAPI(`/${user._id}/unfollow`, null, auth.token);
        socket.emit("unfollowUser", res.data.newUser);

        const msg = {
            id: auth.user._id,
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(removeNotify({ msg, auth, socket }))

    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });
    }
}