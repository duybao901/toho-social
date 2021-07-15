import * as POST_TYPES from '../constants/post'

const initialState = {
    posts: [],
}

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.CREATE_POST: {
            return {
                ...state,
                posts: [...state.posts, action.payload.newPost]
            }
        }
        default: {
            return state
        }
    }
}
export default postReducer;