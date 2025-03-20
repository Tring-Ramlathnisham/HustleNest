import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Dashboard.module.css";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.jobCard}>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <p>Budget: ${job.budget}</p>
      <button onClick={() => navigate(`/submit-proposal/${job.id}`)}>Apply</button>
    </div>
  );
};

export default JobCard;
