
import * as GLOBLE_TYPES from '../constants/index';
import * as NOTIFY_TYPES from '../constants/notifycation';

import { postDataAPI, deleteDataAPI, getDataAPI } from '../../utils/fetchData';
export const createNotify = ({ msg, auth, socket }) => async dispatch => {
    try {
        const res = await postDataAPI('/notify', msg, auth.token);
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
export const removeNotify = ({ msg, auth, socket }) => async dispatch => {
    try {
        const res = await deleteDataAPI(`/notify/${msg.id}?url=${msg.url}`, auth.token);
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