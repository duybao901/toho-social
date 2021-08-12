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
        default: {
            return state
        }
    }
}

export default messageReducer;