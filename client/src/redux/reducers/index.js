import { combineReducers } from 'redux'

import auth from '../reducers/authReducer'
import notify from "../reducers/notifyReducer";

const myReducer = combineReducers({
    auth,
    notify
});

export default myReducer;