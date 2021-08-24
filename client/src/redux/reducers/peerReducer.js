import * as CALL_TYPES from "../constants/call"

const peerReducer = (state = null, action) => {
    switch (action.type) {
        case CALL_TYPES.PEER: {
            return action.payload
        }
        default:
            return state;
    }
}

export default peerReducer;