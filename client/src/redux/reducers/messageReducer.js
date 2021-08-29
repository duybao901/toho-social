import * as MESSAGE_TYPES from '../constants/message';
import { EditData } from '../constants/index'
const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false,
    loadingMessages: false,
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.LOADING_MESSAGES: {
            return {
                ...state,
                loadingMessages: action.payload
            }
        }
        case MESSAGE_TYPES.ADD_USER: {
            if (state.users.every(item => item._id !== action.payload._id)) {
                return {
                    ...state,
                    users: [action.payload, ...state.users]
                }
            }
            return state;
        }
        case MESSAGE_TYPES.ADD_MESSAGE: {
            return {
                ...state,
                data: state.data.map(item => item._id === action.payload.recipient || item._id === action.payload.sender ? {
                    ...item,
                    messages: [...item.messages, action.payload],
                    result: item.result + 1
                } : ""),
                users: state.users.map(user => {
                    return user._id === action.payload.recipient || user._id === action.payload.sender ?
                        { ...user, text: action.payload.text, media: action.payload.media, call: action.payload.call } : user
                })
            }
        }
        case MESSAGE_TYPES.GET_CONVERSATION: {
            return {
                ...state,
                users: action.payload.conversation,
                resultUsers: action.payload.result,
                firstLoad: true,
            }
        }
        case MESSAGE_TYPES.GET_MESSAGES: {
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        }
        case MESSAGE_TYPES.UPDATE_MESSAGES: {
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            }
        }
        case MESSAGE_TYPES.DELETE_MESSAGE: {
            return {
                ...state,
                data: state.data.map((item) => item._id === action.payload._id ?
                    { ...item, messages: action.payload.newData } :
                    item
                )
            }
        }
        case MESSAGE_TYPES.DELETE_CONVERSATION: {
            return {
                ...state,
                users: state.users.filter((item) => item._id !== action.payload),
                data: state.data.filter((item) => item._id !== action.payload)
            }
        }
        case MESSAGE_TYPES.CHECK_USER_ONLINE_OFFLINE: {
            return {
                ...state,
                users: state.users.map(user => {
                    return action.payload.includes(user._id) ? { ...user, online: true } : { ...user, online: false }
                }),

            }
        }
        default: {
            return state
        }
    }
}

export default messageReducer;