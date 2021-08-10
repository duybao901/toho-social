
import * as GLOBLE_TYPES from '../constants/index';
import * as NOTIFY_TYPES from '../constants/notifycation';
import axios from 'axios'

import { postDataAPI, deleteDataAPI, getDataAPI, patchDataAPI } from '../../utils/fetchData';


export const createNotify = ({ msg, auth, socket }) => async dispatch => {
    try {
        if (msg.recipients.includes(auth.user._id)) return;

        const res = await postDataAPI('/notify', msg, auth.token);

        socket.emit('createNotify', {
            ...res.data.notify,
            user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        });
    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })
    }
}

export const removeNotify = ({ msg, auth, socket }) => async dispatch => {
    try {
        await deleteDataAPI(`/notify/${msg.id}?url=${msg.url}`, auth.token);
        socket.emit('removeNotify', msg);
    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })
    }
}

export const getNotifies = (token) => async dispatch => {
    try {
        dispatch({ type: NOTIFY_TYPES.LOADING, payload: true })

        const res = await getDataAPI('/notifies', token);
        dispatch({ type: NOTIFY_TYPES.GET_NOTIFICATION, payload: res.data.notify })
        dispatch({ type: NOTIFY_TYPES.LOADING, payload: false })
    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })
    }
}

export const isReadNotify = (msg, auth) => async dispatch => {
    dispatch({ type: NOTIFY_TYPES.ISREAD_NOTIFICATION, payload: { ...msg, isRead: true } })
    try {
        const res = await patchDataAPI(`/notify_read/${msg._id}`, null, auth.token);
        console.log(res);
    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })
    }
}
export const deleteAllNotify = (auth) => async dispatch => {
    console.log("deleteAllNotify")
    dispatch({ type: NOTIFY_TYPES.DELETE_ALL_NOTIFICATION, payload: [] })
    try {     
       await axios.delete(`/api/delete_notifies`, {
            headers: {
                Authorization: auth.token
            }
        })
    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })

    }
}