import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './Components/Home';
import Auth from './Components/Auth/Auth';
import CompleteProfile from './Components/CompleteProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Login' element={<Auth />} />
        <Route path='/CompleteProfile' element={<CompleteProfile />} />
      </Routes>
    </Router>
  )
}

export default App