import * as ONLINE_TYPES from '../constants/online';

const initialState = {
    data: []
}

const onlineReducer = (state = initialState, action) => {
    switch (action.type) {
        case ONLINE_TYPES.ONLINE: {
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        }
        case ONLINE_TYPES.OFFLINE: {

            return {
                ...state,
                data: state.data.filter(item => item !== action.payload)
            }
        }
        default:
            return state;
    }
}

export default onlineReducer;
