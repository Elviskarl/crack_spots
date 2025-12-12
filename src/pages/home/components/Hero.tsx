import "../styles/index.css";

function Hero() {
  return (
    <section className="hero-section">
      <h1 className="hero-title">
        <span className="highlight-text highlight-text-primary">
          Better roads{" "}
        </span>{" "}
        start with the people who actually use them —{" "}
        <span className="highlight-text highlight-text-secondary">You.</span>
      </h1>
      <ul className="hero-text-container">
        <li className="hero-text">
          Road looking rough? Capture the chaos and share it where it’ll finally
          get attention.
        </li>
        <li className="hero-text">
          Crowd-sourcing better roads:{" "}
          <span className="highlight-text-secondary">You take a photo</span>,{" "}
          <span className="highlight-text-primary">We geo-tag it.</span>
        </li>
      </ul>
    </section>
  );
}

export default Hero;
