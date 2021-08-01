import * as SUGGESTION_TYPES from '../constants/suggestion'
import * as GLOBLE_TYPES from '../constants/index'
import { getDataAPI } from '../../utils/fetchData'

export const getSuggestionUser = ({ auth }) => async dispatch => {
    try {

        dispatch({ type: SUGGESTION_TYPES.LOADING, payload: true })

        const res = await getDataAPI('/suggestion', auth.token);

        dispatch({ type: SUGGESTION_TYPES.GET_USERS, payload: res.data.users })

        dispatch({ type: SUGGESTION_TYPES.LOADING, payload: false })

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