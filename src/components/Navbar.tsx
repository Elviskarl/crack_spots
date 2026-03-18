import { NavLink, Outlet } from "react-router-dom";
import imgSrc from "../assets/app_logo.jpg";
import "./styles/index.css";

function Navbar() {
  return (
    <>
      <nav>
        <div className="left-nav-section">
          <div className="image-container">
            <img src={imgSrc} alt="App logo" className="app-image-logo" />
          </div>
          <span className="app-title">crackspots</span>
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
          <li>
            <NavLink to="/api">Docs</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
