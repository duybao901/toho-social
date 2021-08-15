import * as MESSAGE_TYPES from '../constants/message';

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    resultData: 0,
    firstLoad: false,
    loadingMessage: false
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.LOADING_MESSAGES: {
            return {
                ...state,
                loadingMessage: action.payload
            }
        }
        case MESSAGE_TYPES.ADD_USER: {
            return {
                ...state,
                users: [...state.users, action.payload]
            }
        }
        case MESSAGE_TYPES.ADD_MESSAGE: {
            return {
                ...state,
                data: [...state.data, action.payload],
                users: state.users.map(user => {
                    return user._id === action.payload.recipient || user._id === action.payload.sender ?
                        { ...user, text: action.payload.text, media: action.payload.media } : user
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
                data: action.payload.messages.reverse(),
                dataUsers: action.payload.result
            }
        }
        default: {
            return state
        }
    }
}

export default messageReducer;