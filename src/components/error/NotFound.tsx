import { Link } from "react-router-dom";
import "./styles/index.css";
// import notFoundImage from "../../assets/not_found.jpg";

function NotFound() {
  return (
    <>
      <section className="not_found_container">
        <div className="not-found-content">
          <h2>Oops, Wrong Turn...</h2>
          <p>We can't find the page you are looking for</p>
          <Link to="/" className="navigate-link">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
