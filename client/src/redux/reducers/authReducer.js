import * as TYPES from '../constants/index'
import * as USER_TYPES from '../constants/user';

const initialState = {};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.AUTH:
            return action.payload;
        case USER_TYPES.CHANGE_AVATAR: {
            const { imageURL } = action.payload;
            state.user.avatar = imageURL;
            return { ...state };
        }
        case USER_TYPES.CHANGE_BACKGROUND: {
            const { imageURL } = action.payload;
            state.user.background = imageURL;
            return { ...state };
        }       
        default:
            return state;
    }
}
export default authReducer;