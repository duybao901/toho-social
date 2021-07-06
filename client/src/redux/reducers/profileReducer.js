import * as GLOBLE_TYPES from '../constants/profile'

const initialState = {
    loading: false,
    users: [],
    posts: [],
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBLE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case GLOBLE_TYPES.GET_USER:
            return {
                ...state,
                users: [...state.users, action.payload.user]
            };
        default: {
            return state;
        }
    }
}

export default profileReducer