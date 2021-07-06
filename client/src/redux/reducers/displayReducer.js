const initialState = {
};

const displayReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SHOW":
            return action.payload;
        default:
            return state;
    }
}
export default displayReducer;