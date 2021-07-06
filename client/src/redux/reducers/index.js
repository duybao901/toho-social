import { combineReducers } from 'redux';

import auth from './authReducer';
import notify from "./notifyReducer";
import profile from "./profileReducer";
import display from './displayReducer'
import editMedia from './editmediaReducer'

const myReducer = combineReducers({
    auth,
    notify,
    profile,
    display,
    editMedia
});

export default myReducer;