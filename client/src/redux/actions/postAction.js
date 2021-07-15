import * as GLOBLE_TYPES from '../constants/index';
import * as POST_TYPES from '../constants/post';
import { imagesUpload } from '../../utils/imageUpload';
import { postDataAPI } from '../../utils/fetchData';

export const createPost = ({ content, images, auth }) => async dispatch => {
    let media = [];
    try {
        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: { loading: true, } });
        if (images.length > 0) media = await imagesUpload(images);

        const res = await postDataAPI('create_post',
            { content, images: media }, auth.token
        );

        dispatch({
            type: POST_TYPES.CREATE_POST,
            payload: { newPost: res.data.newPost },
        })

        dispatch({ type: GLOBLE_TYPES.NOTIFY, payload: {} });


    } catch (error) {
        return dispatch({
            type: GLOBLE_TYPES.NOTIFY,
            payload: {
                err: error.response.data.msg
            }
        })
    }
}