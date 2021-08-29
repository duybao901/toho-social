import * as MESSAGE_TYPES from '../constants/message';
import * as GLOBLE_TYPES from '../constants/index';
import { postDataAPI, getDataAPI, deleteDataAPI } from '../../utils/fetchData'

export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {
    dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: msg });
    const { _id, username, fullname, avatar } = auth.user;
    socket.emit("addMessage", { ...msg, user: { username, fullname, avatar, _id } });
    try {
        await postDataAPI('message', msg, auth.token);
    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });

    }
}

export const getConversation = ({ auth, page }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversation?limit=${page ? page * 10 : 10}`, auth.token);
        const newArray = [];

        res.data.conversation.forEach(item => {
            item.recipients.forEach(cv => {
                if (cv._id !== auth.user._id) {
                    newArray.push({ ...cv, text: item.text, media: item.media, call: item.call });
                }
            })
        })  

        dispatch({
            type: MESSAGE_TYPES.GET_CONVERSATION,
            payload: {
                conversation: newArray,
                result: res.data.result
            }
        })
    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });

    }
}

export const getMessages = ({ id, auth, page = 1 }) => async (dispatch) => {
    try {

        dispatch({ type: MESSAGE_TYPES.LOADING_MESSAGES, payload: true });

        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        const newData = { ...res.data, messages: res.data.messages.reverse(), _id: id, page }

        dispatch({
            type: MESSAGE_TYPES.GET_MESSAGES,
            payload: newData
        })
        dispatch({ type: MESSAGE_TYPES.LOADING_MESSAGES, payload: false });

    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });

    }
}

export const updateMessages = ({ id, auth, page = 1 }) => async (dispatch) => {
    try {

        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);
        const newData = { ...res.data, messages: res.data.messages.reverse(), _id: id, page }
        dispatch({ type: MESSAGE_TYPES.UPDATE_MESSAGES, payload: newData });

    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });

    }
}

export const deleteMessages = ({ msg, auth, data }) => async (dispatch) => {
    const newData = data.filter(item => item._id !== msg._id);
    dispatch({ type: MESSAGE_TYPES.DELETE_MESSAGE, payload: { newData, _id: msg.recipient } });
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token);
    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });

    }
}

export const deleteConversation = ({ id, auth }) => async (dispatch) => {
    dispatch({ type: MESSAGE_TYPES.DELETE_CONVERSATION, payload: id });
    try {
        const res = await deleteDataAPI(`conversation/${id}`, auth.token);
        console.log(res);
    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });

    }
}

