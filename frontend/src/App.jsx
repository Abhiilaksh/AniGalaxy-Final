
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
import MostPopular from './pages/MostPopular';
import { TV } from './pages/TV';
import { Movies } from './pages/Movies';
import { AnimeInfo } from './pages/AnimeInfo';
import { SearchResult } from './pages/SearchResults';
import { Analytics } from '@vercel/analytics/react';
import { Watch } from './pages/watch';

function App() {

  return (
    <div className='text-white'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:anime" element={<Watch/>} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/anime/:id" element={<AnimeInfo />} />
          <Route path="/movies" element={<Movies/>}/>
          <Route path="/tv" element={<TV/>} />
          <Route path="/most-popular" element={<MostPopular/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </div>
  );
  
}

export default App
