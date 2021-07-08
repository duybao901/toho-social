import * as PROFILE_TYPES from '../constants/profile'

const initialState = {
    loading: false,
    users: [],
    posts: [],
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case PROFILE_TYPES.GET_USER:
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