import * as AUTHTYPES from '../constants/index'
import { postDataAPI } from '../../utils/fetchData'

export const login = (data) => async (dispatch) => {
    try {
        console.log(data);
        dispatch({ type: AUTHTYPES.NOTIFY, payload: { loading: true } });

        const res = await postDataAPI('login', data);

        dispatch({ type: AUTHTYPES.NOTIFY, payload: { success: res.data.msg } });
        console.log(res);
        dispatch({
            type: AUTHTYPES.AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        });
        localStorage.setItem('firstLogin', true);

    } catch (err) {
        dispatch({ type: AUTHTYPES.NOTIFY, payload: { err: err.response.data.msg } });
    }
}