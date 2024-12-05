
import './App.css'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Home } from './pages/Home';
import Signup from './pages/Signup'
import { Signin } from './pages/Signin';
import Navbar from './components/navbar';

function App() {

  return (
    <div className='text-white'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
  
}

export default App
