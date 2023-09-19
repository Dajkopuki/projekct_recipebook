import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Search from "./Search";
import logo from './t7.png';

function App() {
  return (
    <div className="App">
      <div id="fineHeader">
      <img src={logo} alt="T7 Video library" id="headerPng"/> <h1 className='niceh1'>T7 Video Library</h1>
        <p>Your ultimate YouTube educational video database</p>
      </div>

        <div className="container">
            <Search/>
        </div>

    </div>
  );
}

export default App;