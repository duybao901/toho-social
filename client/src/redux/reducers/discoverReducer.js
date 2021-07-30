import * as DISCOVER_TYPES from '../constants/discover'

const initialState = {
    posts: [],
    result: 0,
    page: 2,
    firstLoad: false,
    loading: false,
    stopScroll: false,
}

export const discoverReducer = (state = initialState, action) => {
    switch (action.type) {
        case DISCOVER_TYPES.LOADING: {
            return {
                ...state,
                loading: action.payload
            }
        }
        case DISCOVER_TYPES.GET_POSTS: {
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                firstLoad: true,
            }
        }
        case DISCOVER_TYPES.UPDATE_DISCOVER: {
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                page: state.page + 1,
                stopScroll: state.result === action.payload.result ? true : false
            }
        }
        default: return state;
    }
}

export default discoverReducer;