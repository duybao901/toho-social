import { combineReducers } from 'redux';

import auth from './authReducer';
import notify from "./notifyReducer";
import profile from "./profileReducer";
import display from './displayReducer'
import editMedia from './editmediaReducer'
import homePost from './postReducer';
import status from './statusReducer'

const myReducer = combineReducers({
    auth,
    notify,
    profile,
    display,
    editMedia,
    homePost,
    status
});

export default myReducer;