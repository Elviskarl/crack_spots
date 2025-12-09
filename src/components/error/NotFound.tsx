import { Link } from "react-router-dom";
import "./styles/index.css";

function NotFound() {
  return (
    <>
      <section className="not_found_container">
        <p>
          <span className="error_status">404</span>
          This route doesn't exist.
        </p>
        <p>
          Back to
          <Link to="/">Homepage </Link>
        </p>
      </section>
    </>
  );
}

export default NotFound;
