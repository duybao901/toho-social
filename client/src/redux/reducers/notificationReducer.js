import * as NOTIFY_TYPES from '../constants/notifycation';
import { EditData } from '../constants/index'
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
        case NOTIFY_TYPES.CREATE_NOTIFICATION: {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }
        case NOTIFY_TYPES.REMOVE_NOTIFICATION: {
            return {
                ...state,
                data: state.data.filter(item => {
                    return item.id !== action.payload.id || item.url !== action.payload.url
                })
            }
        }
        case NOTIFY_TYPES.ISREAD_NOTIFICATION: {
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            }
        }
        case NOTIFY_TYPES.SOUND_NOTIFICATION: {
            return {
                ...state,
                sound: action.payload
            }
        }
        case NOTIFY_TYPES.DELETE_ALL_NOTIFICATION: {
            return {
                ...state,
                data: action.payload,
            }
        }
        default: return state;
    }
}

export default notificationReducer;