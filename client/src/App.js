import React, { useEffect } from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import PageRender from './customRouter/PageRender';
import Home from './pages/home';
import Login from './pages/login'
import Register from './pages/register'
import PrivateRouter from './customRouter/PrivateRoute';
import Notify from './components/norify/Notify';
import WatchImg from './components/watchimg/WatchImg';
import EditMedia from './components/editmedia/EditMedia';
import Header from './components/header/Header';
import CallModal from './components/message/CallModal';
import * as authActions from './redux/actions/authAction'
import * as postActions from './redux/actions/postAction'
import * as suggestionActions from './redux/actions/suggestionAction'
import * as notifyActions from './redux/actions/notifyAction'
import * as GLOBLE_TYPES from './redux/constants/index'
import * as CALL_TYPES from './redux/constants/call'

// Socket IO
import { io } from 'socket.io-client'
import SocketClient from './SocketClient';
// PeerJS
import Peer from 'peerjs'

function App() {

    const { auth, notify, call } = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authActions.refreshToken());
        const socket = io();
        dispatch({ type: GLOBLE_TYPES.SOCKET, payload: socket })
        return () => {
            socket.close();
        }
    }, [dispatch])

    useEffect(() => {
        if (auth.token) {
            dispatch(postActions.getPosts(auth.token));
            dispatch(suggestionActions.getSuggestionUser(auth.token));
            dispatch(notifyActions.getNotifies(auth.token));

        }
    }, [dispatch, auth.token])


    useEffect(() => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
            });
        }
    }, [])

    useEffect(() => {
        const peer = new Peer(undefined, {
            path: '/',
            secure: true
        })
        dispatch({ type: CALL_TYPES.PEER, payload: peer })
    }, [dispatch])


    return (
        <div className="App"
            style={{
                overflowY: notify.loading ? 'hidden' : "auto",
                maxHeight: notify.loading && '100vh'
            }}
        >
            {notify && <Notify />}
            <WatchImg />
            <EditMedia />
            {auth.token && <SocketClient />}
            {call && <CallModal />}
            <div className='main'>
                <div className="main__container">
                    {auth.token && <Header />}

                    <Route path='/' component={auth.token ? Home : Login} exact />
                    <Route path='/register' component={Register} exact />

                    <PrivateRouter path='/:page' component={PageRender} exact />
                    <PrivateRouter path='/:page/:id' component={PageRender} exact />
                </div>
            </div>
        </div>
    );
}

export default App;
