import { NavLink, Outlet } from "react-router-dom";
import imgSrc from "../assets/app_logo.jpg";
import "./styles/index.css";
import "./styles/navbarMediaQuerry.css";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <nav>
        <div className="left-nav-section">
          <div className="image-container">
            <img src={imgSrc} alt="App logo" className="app-image-logo" />
          </div>
          <span className="app-title">crackspots</span>
        </div>
        <ul className={`main-nav-section ${isOpen ? "open" : ""}`}>
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
            <NavLink to="/api">Documentation</NavLink>
          </li>
        </ul>
        <div
          className="nav-menu"
          ref={menuRef}
          onClick={() => setIsOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          aria-label="Toggle navigation menu"
        >
          <div className="menu-img-container" title="menu">
            <svg className="icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M4.5 17q-.213 0-.356-.144T4 16.499t.144-.356T4.5 16h10.423q.213 0 .356.144t.144.357t-.144.356t-.356.143zm14.439-1.258l-3.197-3.177Q15.5 12.324 15.5 12t.242-.565l3.196-3.158q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.353L16.573 12l3.073 3.035q.16.133.16.34t-.16.367q-.134.14-.34.14q-.208 0-.368-.14M4.5 12.5q-.213 0-.356-.144T4 11.999t.144-.356t.356-.143h7.577q.213 0 .356.144t.144.357t-.144.356t-.356.143zm0-4.5q-.213 0-.356-.144T4 7.499t.144-.356T4.5 7h10.423q.213 0 .356.144t.144.357t-.144.356t-.356.143z"
              />
            </svg>
          </div>
          <span className="menu-label">Menu</span>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
