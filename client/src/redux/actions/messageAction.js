import * as MESSAGE_TYPES from '../constants/message';
import * as GLOBLE_TYPES from '../constants/index';
import { postDataAPI, getDataAPI } from '../../utils/fetchData'
export const addUser = (user, message) => async (dispatch) => {
    if (message.users.every(item => item._id !== user._id)) {
        dispatch({ type: MESSAGE_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
    }
}



export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {
    dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: msg });
    socket.emit("addMessage", msg);
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
                    newArray.push({ ...cv, text: item.text, media: item.media });
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

export const getMessages = ({ id, auth, page }) => async (dispatch) => {
    try {

        dispatch({
            type: MESSAGE_TYPES.LOADING_MESSAGES,
            payload: true
        })

        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token);

        dispatch({
            type: MESSAGE_TYPES.GET_MESSAGES,
            payload: {
                messages: res.data.messages,
                result: res.data.result
            }
        })

        dispatch({
            type: MESSAGE_TYPES.LOADING_MESSAGES,
            payload: false
        })

    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });

    }
}
