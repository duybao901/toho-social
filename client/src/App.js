
import './App.css';
import { Route } from 'react-router-dom'
import pageRender from './PageRender';
function App() {
  return (
    <div className="App">
      <div className='main'>
        <Route path='/:page' component={pageRender} />
        asd
      </div>
    </div>
  );
}

export default App;
