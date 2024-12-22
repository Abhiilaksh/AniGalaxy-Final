import { useState, useEffect } from "react";
import { Heading } from "./Heading";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchBox from "./Search";


const Navbar = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [menu, setMenu] = useState(false);
  
  const [userImage, setUserImage] = useState("");
  // Get the current pathname from useLocation
  const location = useLocation();

  useEffect(() => {
    const checkIsPhone = () => {
      setIsPhone(window.innerWidth <= 1200);
    };
    checkIsPhone();
    window.addEventListener("resize", checkIsPhone);

    const token = localStorage.getItem("token");
   

    if (token) {
      setIsLoggedin(true);
      
    }

    return () => {
      window.removeEventListener("resize", checkIsPhone);
    };
  }, []);

  const handleMenuToggle = () => {
    setMenu(prevMenu => !prevMenu); 
  };

  const handleLinkClick = () => {
    setMenu(false); 
  };

  const isActive = (path) => location.pathname === path ? ' text-white font-semibold' : '';

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-40 backdrop-blur-0 text-white mt-[-18px]  pb-2 z-50">
      {isPhone ? (
        <div className="flex justify-between pt-2">
          <Link to="/" className="pl-2">
            <Heading label="AniGalaxy" size="2xl" />
          </Link>
        <div className="mt-5 px-4 "><SearchBox/></div>
          <button onClick={handleMenuToggle}>
            <div className="pr-4 pt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="text-xl font-semibold">
            <Heading label="AniGalaxy" />
          </Link>

          <nav className="pt-5">
            <ul className="flex space-x-8 text-lg text-slate-300 gap-8 items-center">
              <li>
                <Link to="/" className={`block py-2 ${isActive('/')}`}>Home</Link>
              </li>
              <li>
                <Link to="/most-popular" className={`block py-2 ${isActive('/most-popular')}`}>Most Popular</Link>
              </li>
              <li>
                <Link to="/tv" className={`block py-2 ${isActive('/tv')}`}>TV</Link>
              </li>
              <li>
                <Link to="/movies" className={`block py-2 ${isActive('/movies')}`}>Movies</Link>
              </li>
              <li>
                <Link to="/a-z/a" className={`block py-2 ${isActive('/a-z/:id')}`}>Index</Link>
              </li>
              <li><SearchBox/></li>
              <li>
                {isLoggedin ? (
                  <Link to="/profile" className={`block py-2 ${isActive('/profile')}`}>
                    <div className="ml-[-40px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-9">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
                    </div>

                  </Link>
                ) : (
                  <Link to="/signin" className={`block py-2 ${isActive('/profile')}`}>
                    <div className="ml-[-40px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-9">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
                    </div>

                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}

      <Sidebar menu={menu} handleLinkClick={handleLinkClick} isActive={isActive} isLoggedin={isLoggedin} />
    </nav>
  );
};

export default Navbar;
