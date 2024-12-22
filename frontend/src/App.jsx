import './App.css'
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
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
import { Watch } from './pages/WatchAnime';
import { Profile } from './pages/Profile';
import { Footer } from './components/Footer';
import { AZList } from './pages/A-Zlist';

function App() {
  return (
    <div className='text-white'>
      <BrowserRouter>
        <RoutesWrapper />
      </BrowserRouter>
    </div>
  );
}

function RoutesWrapper() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:anime" element={<Watch />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/anime/:id" element={<AnimeInfo />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/most-popular" element={<MostPopular />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/a-z/:alpha" element={<AZList />} />
      </Routes>
      <Analytics />
      {/* Render Footer only if the path doesn't start with /a-z/ */}
      {!location.pathname.startsWith('/a-z/') && <Footer />}
    </>
  );
}

export default App;
