import './App.css';
import { Route } from 'react-router-dom'
import pageRender from './PageRender';
import Home from './pages/home';
function App() {
  return (
    <div className="App">
      <div className='main'>
        <Route path='/' component={Home} exact/>
        <Route path='/:page' component={pageRender} exact />
        <Route path='/:page/:id' component={pageRender} exact />
      </div>
    </div>
  );
}

export default App;
