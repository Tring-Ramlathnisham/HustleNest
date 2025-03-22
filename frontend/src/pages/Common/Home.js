import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import freelance from "../../Assets/freelance1.jpg"

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      {/* Left Section - Text Content */}
      <div className={styles.heroText}>
        <h1>
          <span className={styles.highlight}>Empower</span> your 
          <span className={styles.highlight}> Work! </span>Connect,
          <span className={styles.highlight}> Collaborate, and </span> Succeed!
        </h1>
        <p>
          Unlock endless possibilities with top freelancers and world-class projects. 
          Join our growing community today!
        </p>
        <div className={styles.ctaButtons}>
          <button className={styles.btnPrimary} onClick={() => navigate("/register")}>Work as a freelancer</button>
          <button className={styles.btnSecondary} onClick={()=>navigate("/register")}>Hire a freelancer</button>
        </div>
      </div>

      {/* Right Section - Image Placeholder */}
      <div className={styles.heroImage}>
        <div className={styles.imagePlaceholder}>
          <img src={freelance} alt="Freelancer working"/>
        </div>
      </div>
    </div>
  );
};

export default Home;
