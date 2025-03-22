import React from "react";
import { useSelector } from "react-redux";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import styles from "./JobList.module.css";


const GET_CLIENT_JOBS = gql`
  query GetClientJobs($clientId: ID!) {
    getClientDashboardStats(clientId: $clientId) {
      jobs {
        id
        title
        proposalCount
      }
    }
  }
`;

const JobList = () => {
  const user = useSelector((state) => state.auth?.user);
  const clientId = user?.id || null;  
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_CLIENT_JOBS, {
    variables: { clientId: clientId},
  });

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error loading jobs</p>;

  return (
    <div className={styles.jobListPage}>
      <h3>Posted Jobs</h3>
      <div className={styles.jobGrid}>
        {data.getClientDashboardStats.jobs.map((job) => (
          <div
            key={job.id}
            className={styles.jobCard}
            onClick={() => navigate(`/client/manageProposals/${job.id}`)}
          >
            <h4>{job.title}</h4>
            <p>Proposals: <span className={styles.proposalCount}>{job.proposalCount}</span></p>
          </div>
        ))}
      </div>
      <button className={styles.backButton} onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default JobList;
