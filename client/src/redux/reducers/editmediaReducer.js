const initialState = {
};
// aspectX: 0,
// aspectY: 0,
// imageWidth: 0,
// imageHeight: 0,
// show: false,
// image: ''

const editMediaReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SHOW_MEDIA":
            return action.payload;
        default:
            return state;
    }
}
export default editMediaReducer;