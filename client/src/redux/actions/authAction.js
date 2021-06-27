import * as AUTHTYPES from '../constants/index'
import { postDataAPI } from '../../utils/fetchData'

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: AUTHTYPES.NOTIFY, payload: { loading: true } });

        const res = await postDataAPI('login', data);

        dispatch({
            type: AUTHTYPES.AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        });

        dispatch({ type: AUTHTYPES.NOTIFY, payload: { success: res.data.msg } });


        localStorage.setItem('firstLogin', true);

    } catch (err) {
        dispatch({ type: AUTHTYPES.NOTIFY, payload: { err: err.response.data.msg } });
    }
}

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
        dispatch({ type: AUTHTYPES.NOTIFY, payload: { loading: true } });
        try {
            const res = await postDataAPI('refresh_token');

            dispatch({
                type: AUTHTYPES.AUTH,
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            });

            dispatch({ type: AUTHTYPES.NOTIFY, payload: {} });

        } catch (err) {
            dispatch({ type: AUTHTYPES.NOTIFY, payload: { err: err.response.data.msg } });
        }
    }
}