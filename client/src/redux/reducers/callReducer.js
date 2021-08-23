import * as CALL_TYPES from "../constants/call"

const callReducer = (state = null, action) => {
    switch (action.type) {
        case CALL_TYPES.CALL: {
            return action.payload
        }
        default:
            return state;
    }
}

export default callReducer;