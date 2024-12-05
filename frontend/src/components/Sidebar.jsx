import { Link } from "react-router-dom";
import SearchBox from "./Search";

const Sidebar = ({ menu, handleLinkClick, isActive, isLoggedin }) => {
  return (
    menu && (
      <div className="bg-black bg-opacity-70 backdrop-blur-0 text-white pl-4 py-2 mt-2 rounded-md mr-2">
        <ul>
          <li>
            <Link to="/" className={`block py-2 ${isActive('/')}`} onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/most-popular" className={`block py-2 ${isActive('/most-popular')}`} onClick={handleLinkClick}>
              Most Popular
            </Link>
          </li>
          <li>
            <Link to="/tv" className={`block py-2 ${isActive('/tv')}`} onClick={handleLinkClick}>
              TV
            </Link>
          </li>
          <li>
            <Link to="/movies" className={`block py-2 ${isActive('/movies')}`} onClick={handleLinkClick}>
              Movies
            </Link>
          </li>
          
          <li>
            {isLoggedin ? (
              <Link to="/profile" className={`block py-2 ${isActive('/profile')}`} onClick={handleLinkClick}>
                Profile
              </Link>
            ) : (
              <Link to="/signin" className={`block py-2 ${isActive('/signin')}`} onClick={handleLinkClick}>
                Login
              </Link>
            )}
          </li>
          <li className="py-2"><SearchBox></SearchBox></li>
        </ul>
      </div>
    )
  );
};

export default Sidebar;
