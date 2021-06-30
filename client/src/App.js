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
import Header from './components/header/Header';
import * as authActions from './redux/actions/authAction'
function App() {
  const { auth } = useSelector(state => state);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authActions.refreshToken());
  }, [dispatch])

  return (
    <div className="App">
      <Notify />
      <div className='main'>
        <div className="main__container">
          {auth.token && <Header />}
          <div className={auth.token ? "main__content have__login" : "main__content"}>
            <Route path='/' component={auth.token ? Home : Login} exact />
            <Route path='/register' component={Register} exact />

            <PrivateRouter path='/:page' component={PageRender} exact/>
            <PrivateRouter path='/:page/:id' component={PageRender} exact/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
