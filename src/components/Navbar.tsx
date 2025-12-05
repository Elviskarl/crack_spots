import { NavLink, Outlet } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav>
        <section>
          <div className="left-nav-section"></div>
          <div className="main-nav-section">
            <ul>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/map">Map</NavLink>
              <NavLink to="/about">About</NavLink>
            </ul>
          </div>
        </section>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
