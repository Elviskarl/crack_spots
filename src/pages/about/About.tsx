import { Link } from "react-router-dom";
import imageUrl from "../../assets/about-page.jpg";
import githubLogo from "../../assets/logo-github.svg";
import "./styles/index.css";
import "./styles/aboutPageMediaQuerry.css";

function About() {
  return (
    <section className="about-section-page">
      <h2 className="about-section-app-title">crackspots</h2>
      <div className="about-section-intro">
        <div className="about-section-card">
          <h3>A brief introduction</h3>
          <p className="intro-paragraph">
            Road infrastructure issues often go unnoticed or take time to reach
            the appropriate authorities. Small problems like potholes, cracks,
            or damaged signage can grow into safety risks if they aren’t
            documented early.
          </p>
          <p className="content">
            This application allows anyone to report road infrastructure issues
            as they encounter them. By uploading a photo and confirming its
            location, users can create a visible, map-based record of reported
            problems. Each report appears on an interactive map, helping build a
            clearer picture of where issues exist and how widespread they are.
          </p>
        </div>
        <div className="about-section-image-container">
          <img
            src={imageUrl}
            alt="About section image"
            className="about-section-image"
          />
        </div>
      </div>
      <div className="about-section-design-considerations">
        <div className="about-section-card">
          <h3>Design & Considerations</h3>
          <p className="content">
            Crackspots is currently implemented as a pilot project operating
            within Nairobi County. Limiting the platform to a single geographic
            region allows the application to focus on improving its core
            functionality, that is- reporting, mapping, and visualization of
            road infrastructure issues.
          </p>
          <p className="content">
            As the project grows and more data is collected, the platform is
            intended to scale beyond its initial scope. The underlying structure
            of the application is designed with expansion in mind, allowing
            additional regions to be incorporated as the reporting system
            matures and the dataset becomes more representative.
          </p>
          <p className="content">
            In this sense, the current limitation to Nairobi should be
            understood not as a restriction of the system’s capability, but as a
            deliberate starting point, providing an opportunity to observe how
            the platform performs gradually building a reliable body of data
            that can support future expansion.
          </p>
        </div>
      </div>
      <div className="about-section-main">
        <div className="about-section-card">
          <h3>How it works</h3>
          <p className="content">
            Reports are submitted by users and reflect on-the-ground
            observations. Locations are based on image metadata or user input,
            and reports are displayed for informational purposes.
          </p>
          <p className="content">
            This project explores how web mapping and user-generated data can be
            used to improve awareness around road infrastructure and the spaces
            we move through every day.
          </p>
        </div>
        <div className="github-space">
          <h3>Contributions</h3>
          <p className="content">
            CrackSpots is developed as an open-source project.
            <span className="link-to-docs">
              <Link
                to="/api"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                see documentation
              </Link>
            </span>
          </p>
          <p className="content">
            The GitHub repository contains the complete source code,
            documentation, and development history of the platform.
          </p>
          <p className="content">
            Developers and contributors can explore the implementation, follow
            updates, report issues, and submit improvements through pull
            requests.
          </p>
          <p className="content">
            If you are interested in improving or adding to the project, your
            participation is welcomed.{" "}
          </p>
          <span className="link-to-repo">
            <a
              target="_blank"
              href="https://github.com/Elviskarl/crack_spots"
              className="github-btn"
            >
              <img
                src={githubLogo}
                alt="github-logo"
                className="github-logo "
              />
              view on GitHub
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}

export default About;
