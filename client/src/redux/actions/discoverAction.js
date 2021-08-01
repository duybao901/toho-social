import * as DISCOVER_TYPES from '../constants/discover'
import * as GLOBLE_TYPES from '../constants/index'
import { getDataAPI } from '../../utils/fetchData'

export const getDiscoverPosts = (token) => async (dispatch) => {
    try {

        dispatch({
            type: DISCOVER_TYPES.LOADING,
            payload: true
        })

        const res = await getDataAPI('/post_discover?limit=6', token);
        dispatch({
            type: DISCOVER_TYPES.GET_POSTS,
            payload: res.data
        })

        dispatch({
            type: DISCOVER_TYPES.LOADING,
            payload: false
        })

    } catch (error) {
        if (error) {
            return dispatch({
                type: GLOBLE_TYPES.NOTIFY,
                payload: {
                    err: error.response.data.msg
                }
            })
        }

    }
}