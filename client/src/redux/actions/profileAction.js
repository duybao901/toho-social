import * as PROFILE_TYPES from '../constants/profile'
import * as GLOBLE_TYPES from '../constants/index'
import { getDataAPI } from '../../utils/fetchData'

export const getProfileUser = ({ users, id, auth }) => async (dispatch) => {

    if (users.every(user => user._id !== id)) {
        try {
            dispatch({ type: PROFILE_TYPES.LOADING, payload: true })

            const res = await getDataAPI(`/user/${id}`, auth.token);

            dispatch({ type: PROFILE_TYPES.GET_USER, payload: res.data })
            dispatch({ type: PROFILE_TYPES.LOADING, payload: false })

        } catch (err) {
            if (err) {
                dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: err.response.data.msg } })
            }
        }
    }
}
