import * as POST_TYPES from '../constants/post'
import { DeleteData } from '../constants/index'
const initialState = {
    loading: false,
    posts: [],
    result: 0,
    page: 2,
    stopScroll: false
}

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.CREATE_POST:
            return {
                ...state,
                posts: [action.payload.newPost, ...state.posts]
            };
        case POST_TYPES.LOADING_POST: {
            return {
                ...state,
                loading: action.payload,
            }
        }
        case POST_TYPES.GET_POSTS: {
            return {
                ...state,
                posts: [...action.payload.posts],
                result: action.payload.result
            }
        }
        case POST_TYPES.UPDATE_HOME_POSTS: {
            return {
                ...state,
                posts: [...action.payload.posts],
                result: action.payload.result,
                page: state.page + 1,
                stopScroll: state.result === action.payload.result ? true : false
            }
        }
        case POST_TYPES.UPDATE_POST: {
            const { newPost } = action.payload;
            const newArrayPost = state.posts.map((post => {
                return post._id === newPost._id ? newPost : post
            }))
            return {
                ...state,
                posts: [...newArrayPost]
            }
        }
        case POST_TYPES.DELETE_POST: {
            return {
                ...state,
                posts: DeleteData(state.posts, action.payload)
            }
        }
        default: {
            return state
        }
    }
}
export default postReducer;