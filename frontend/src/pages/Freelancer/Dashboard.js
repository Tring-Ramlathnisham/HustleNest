import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import styles from "./Dashboard.module.css";
import { useSelector } from "react-redux";

const GET_FREELANCER_STATS = gql`
  query GetFreelancerDashboardStats($freelancerId: ID!) {
    getFreelancerDashboardStats(freelancerId: $freelancerId) {
      totalJobsApplied
      totalProposalsPending
      totalProjectsAccepted
    }
  }
`;

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const user=useSelector((state) => state.auth?.user);
  const freelancerId = user?.id || null;
  console.log("Id:",freelancerId);

  const { data, loading, error } = useQuery(GET_FREELANCER_STATS, {
    variables: freelancerId ? { freelancerId: freelancerId.toString() } : null,
    fetchPolicy:"network-only",
  });
  console.log("Data:",data);

  // Quotes Array
  const quotes = [
    "Success usually comes to those who are too busy to be looking for it.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Opportunities don’t happen. You create them.",
    "The best way to predict the future is to create it.",
    "Work hard in silence, let success make the noise.",
  ];

  // State to store the selected quote
  const [quote, setQuote] = useState("");

  // Function to randomly select a quote on mount
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error loading stats: {error.message}</p>;

  const { totalJobsApplied, totalProposalsPending, totalProjectsAccepted } =
    data?.getFreelancerDashboardStats || {};

  return (
    <div className={styles.dashboardContainer}>
      {/* Left Section - Dynamic Quote & Quick Actions */}
      <div className={styles.heroText}>
        <h1>
          <span className={styles.highlight}>Track</span> Your  
          <span className={styles.highlight}> Freelancing </span>Journey!
        </h1>
        <p className={styles.dynamicQuote}>❝ {quote} ❞</p>

        {/* Quick Action Buttons */}
        <div className={styles.quickActions}>
          <button className={styles.actionBtn} onClick={() => navigate("/freelancer/jobs")}>
            Browse Jobs
          </button>
          <button className={styles.actionBtn} onClick={() => navigate("/freelancer/applications")}>
            View My Applications
          </button>
          <button className={styles.actionBtn} onClick={() => navigate("/freelancer/myProjects")}>
            My Projects
          </button>
        </div>
      </div>

      {/* Right Section - Statistics Cards */}
      {data?.getFreelancerDashboardStats && (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <h2>{data.getFreelancerDashboardStats.totalJobsApplied}</h2> 
            <p>Jobs Applied</p>
          </div>
          <div className={styles.statCard}>
            <h2>{data.getFreelancerDashboardStats.totalProposalsPending}</h2>
            <p>Proposals Pending</p>
          </div>
          <div className={styles.statCard}>
            <h2>{data.getFreelancerDashboardStats.totalProjectsAccepted}</h2>
            <p>Projects Accepted</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default FreelancerDashboard;
