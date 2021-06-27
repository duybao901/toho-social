import React, { useEffect } from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import pageRender from './PageRender';
import Home from './pages/home';
import Login from './pages/login'
import Notify from './components/norify/Notify';
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
        <Route path='/' component={auth.token ? Home : Login}/>
        <Route path='/:page' component={pageRender} />
        <Route path='/:page/:id' component={pageRender} />
      </div>
    </div>
  );
}

export default App;
