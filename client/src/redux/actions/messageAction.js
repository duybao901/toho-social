import * as MESSAGE_TYPES from '../constants/message';

export const addUser = (user, message) => async (dispatch) => {
    if (message.users.every(item => item._id !== user._id)) {
        dispatch({ type: MESSAGE_TYPES.ADD_USER, payload: { user } })
    }
}