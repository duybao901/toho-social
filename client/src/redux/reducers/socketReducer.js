import * as GLOBLE_TYPES from '../constants/index'

const socketReducer = (state = [], action) => {
    switch (action.type) {
        case GLOBLE_TYPES.SOCKET: {
            return action.payload
        }
        default: return state
    }
}

export default socketReducer