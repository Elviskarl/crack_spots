import { NavLink, Outlet } from "react-router-dom";
import imgSrc from "../assets/app_logo.svg";
import "./styles/index.css";

function Navbar() {
  return (
    <>
      <nav>
        <div className="left-nav-section">
          <div className="image-container">
            <NavLink to="/">
              <img src={imgSrc} alt="App logo" className="app-image-logo" />
            </NavLink>
          </div>
        </div>
        <ul className="main-nav-section">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/map">Map</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
