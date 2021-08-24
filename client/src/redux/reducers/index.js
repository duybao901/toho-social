import { combineReducers } from 'redux';

import auth from './authReducer';
import notify from "./notifyReducer"; // Loading 
import profile from "./profileReducer";
import display from './displayReducer'
import editMedia from './editmediaReducer'
import homePost from './postReducer';
import status from './statusReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import suggestion from './suggestionReducer'
import socket from './socketReducer'
import notification from './notificationReducer';
import message from './messageReducer'
import online from './onlineReducer'
import call from './callReducer'
import peer from './peerReducer'



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
    suggestion,
    socket,
    notification,
    message,
    online,
    call,
    peer
});

export default myReducer;