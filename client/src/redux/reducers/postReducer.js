import * as POST_TYPES from '../constants/post'

const initialState = {
    loading: false,
    posts: [],
    result: 0,
    page: 0,
}

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.CREATE_POST: {
            return {
                ...state,
                posts: [action.payload.newPost, ...state.posts]
            }
        }
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
        default: {
            return state
        }
    }
}
export default postReducer;