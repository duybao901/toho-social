import * as POST_TYPES from '../constants/post'

const initialState = {
    onEdit: false,
    post: {},
}

const statusReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.STATUS: {
            return action.payload
        }
        default: return state
    }
}

export default statusReducer