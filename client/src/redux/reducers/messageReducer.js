import * as MESSAGE_TYPES from '../constants/message';

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    resultData: 0,
    firshLoad: false,
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_TYPES.ADD_USER: {
            return {
                ...state,
                users: [...state.users, action.payload.user]
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
        default: {
            return state
        }
    }
}

export default messageReducer;