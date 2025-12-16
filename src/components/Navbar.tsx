import { NavLink, Outlet } from "react-router-dom";
import "./styles/index.css";

function Navbar() {
  return (
    <>
      <nav>
        <div className="left-nav-section">
          <a href="#">Hello</a>
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
