import * as NOTIFY_TYPES from '../constants/notifycation';

const initialState = {
    data: [],
    loading: false,
    sound: false,
}

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFY_TYPES.LOADING: {
            return {
                ...state,
                loading: action.payload,
            }
        }
        case NOTIFY_TYPES.GET_NOTIFICATION: {
            return {
                ...state,
                data: action.payload
            }
        }
        default: return state;
    }
}

export default notificationReducer;