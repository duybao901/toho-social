import * as PROFILE_TYPES from '../constants/profile'

const initialState = {
    loading: false,
    ids: [],
    users: [],
    userPosts: [],
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

        case PROFILE_TYPES.FOLLOW: {
            state.users.map((user) => user._id === action.payload._id)
            return {
                ...state,
                users: state.users.map((user) => user._id === action.payload._id ? action.payload : user)
            }
        }
        case PROFILE_TYPES.UNFOLLOW: {
            state.users.map((user) => user._id === action.payload._id)
            return {
                ...state,
                users: state.users.map((user) => user._id === action.payload._id ? action.payload : user)
            }
        }
        case PROFILE_TYPES.GET_ID: {
            return {
                ...state,
                ids: [...state.ids, action.payload]
            }
        }
        case PROFILE_TYPES.GET_POSTS: {
            return {
                ...state,
                userPosts: [...state.userPosts, action.payload]
            }
        }
        default: {
            return state;
        }
    }
}

export default profileReducer