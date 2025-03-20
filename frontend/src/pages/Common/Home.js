import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import freelance from "../../Assets/freelance1.jpg"

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Left Section - Text Content */}
      <div className="hero-text">
        <h1>
          <span className="highlight">Empower</span> your 
          <span className="highlight"> Work! </span>Connect,
          <span className="highlight"> Collaborate, and </span> Succeed!
        </h1>
        <p>
          Unlock endless possibilities with top freelancers and world-class projects. 
          Join our growing community today!
        </p>
        <div className="cta-buttons">
          <button className="btn primary" onClick={() => navigate("/register")}>Work as a freelancer</button>
          <button className="btn secondary" onClick={()=>navigate("/register")}>Hire a freelancer</button>
        </div>
      </div>

      {/* Right Section - Image/Video Placeholder */}
      <div className="hero-image">
        <div className="image-placeholder">
          <img src={freelance} alt="Freelancer working"/>
          {/* You can replace this div with an <img> or <video> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
