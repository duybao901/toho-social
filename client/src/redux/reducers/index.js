import { combineReducers } from 'redux';

import auth from './authReducer';
import notify from "./notifyReducer";
import profile from "./profileReducer";
import display from './displayReducer'
import editMedia from './editmediaReducer'
import homePost from './postReducer';
import status from './statusReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import suggestion from './suggestionReducer'

const myReducer = combineReducers({
    auth,
    notify,
    profile,
    display,
    editMedia,
    homePost,
    status,
    detailPost,
    discover,
    suggestion
});

export default myReducer;