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
import * as authActions from './redux/actions/authAction'
import * as postActions from './redux/actions/postAction'
import * as suggestionActions from './redux/actions/suggestionAction'

function App() {
    const { auth, notify } = useSelector(state => state);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authActions.refreshToken());
    }, [dispatch])

    useEffect(() => {
        if (auth.token) {
            dispatch(postActions.getPosts(auth.token));
            dispatch(suggestionActions.getSuggestionUser(auth.token));
        }
    }, [dispatch, auth.token])
    return (
        <div className="App"
            style={{
                overflowY: notify.loading ? 'hidden' : "auto",
                maxHeight: notify.loading && '100vh'
            }}
        >
            <Notify />
            <WatchImg />
            <EditMedia />
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
