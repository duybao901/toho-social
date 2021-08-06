import * as PROFILE_TYPES from '../constants/profile'
import { EditData } from '../constants/index'
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
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            }
        }
        case PROFILE_TYPES.UNFOLLOW: {
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
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
        case PROFILE_TYPES.UPDATE_POST: {
            return {
                ...state,
                userPosts: EditData(state.userPosts, action.payload._id, action.payload),
            }
        }
        default: {
            return state;
        }
    }
}

export default profileReducer