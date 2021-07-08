import * as PROFILE_TYPES from '../constants/profile'
import * as GLOBLE_TYPES from '../constants/index'
import { getDataAPI, putDataAPI } from '../../utils/fetchData'

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


export const updateUserProfile = ({ userData, auth }) => async (dispatch) => {
    if (!userData.fullname) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Please add your fullname." } });
    }

    if (userData.fullname.length > 50) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Fullname so long." } });
    }

    if (userData.story.length > 160) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Bio so long." } });
    }

    if (userData.address.length > 100) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Location so long." } });
    }

    if (userData.website.length > 80) {
        return dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: "Website so long." } });
    }

    try {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true } });

        const res = await putDataAPI('edit_profile', { userData }, auth.token);

        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { success: res.data.msg } });

        dispatch({
            type: GLOBLE_TYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user,
                    ...userData,
                }
            }
        })
    } catch (error) {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { err: error.response.data.msg } });
    }
}