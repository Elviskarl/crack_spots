import imageUrl from "../../assets/home_img.jpg";
import "./styles/index.css";

function About() {
  return (
    <>
      <section className="about-section-page">
        <div className="about-section-card">
          <h5>Welcome to Crack-spots</h5>
          <p className="intro-paragraph">
            Road infrastructure issues often go unnoticed or take time to reach
            the right attention. Small problems like potholes, cracks, or
            damaged signage can grow into safety risks if they aren’t documented
            early.
          </p>
        </div>
        <div className="about-section-card">
          <div className="card-image-container">
            <img src={imageUrl} alt="Damage Preview" />
          </div>
          <div className="card-content">
            <p className="content">
              This application makes it easy for anyone to report road
              infrastructure issues as they encounter them. By uploading a photo
              and confirming its location, users can create a visible, map-based
              record of reported problems. Each report appears on an interactive
              map, helping build a clearer picture of where issues exist and how
              widespread they are.
            </p>
          </div>
        </div>
        <div className="about-section-card">
          <div className="card-content">
            <p className="content">
              The app is designed for everyday road users — pedestrians,
              cyclists, drivers, and residents — as well as anyone interested in
              understanding infrastructure conditions in a more visual and
              accessible way.
            </p>
          </div>
        </div>
        <div className="about-section-card">
          <div className="card-content">
            <p className="content">
              Reports are submitted by users and reflect on-the-ground
              observations. Locations are based on image metadata or user input,
              and reports are displayed for informational purposes.
            </p>
          </div>
        </div>
        <div className="about-section-card">
          <div className="card-content">
            <p className="content">
              This project explores how web mapping and user-generated data can
              be used to improve awareness around road infrastructure and the
              spaces we move through every day.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
