// import * as TYPES from '../constants/index'

const initialState = {};

const notifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case "NOTIFY":
            return action.payload;
        default:
            return state;
    }
}
export default notifyReducer;