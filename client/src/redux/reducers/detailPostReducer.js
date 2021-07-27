import * as POST_TYPES from '../constants/post'
import { EditData } from '../constants/index'
export const detailPostReducer = (state = [], action) => {
    switch (action.type) {
        case POST_TYPES.GET_POST: {
            return [...state, action.payload]
        }
        case POST_TYPES.UPDATE_POST: {
            return EditData(state, action.payload.newPost._id, action.payload.newPost)
        }
        default: {
            return state
        }
    }

}

export default detailPostReducer;