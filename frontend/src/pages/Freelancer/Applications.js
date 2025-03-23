import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Applications.module.css";

// 🔹 GraphQL Query to Fetch Applied Jobs for Freelancer
const GET_APPLIED_JOBS = gql`
  query GetAppliedJobs($freelancerId: ID!) {
    getAppliedJobs(freelancerId: $freelancerId) {
      id

      job {
        id
        title
        domain
      }
      clientName
      status
    }
  }
`;

const Applications = () => {
  const navigate=useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const freelancerId = user?.id || null;

  const { data, loading, error } = useQuery(GET_APPLIED_JOBS, {
    variables: freelancerId ? { freelancerId: freelancerId.toString() } : null,
    skip: !freelancerId, 
  });

  if (loading) return <p>Loading applied jobs...</p>;
  if (error) return <p>Error fetching applied jobs.</p>;

  return (
    <div className={styles.appliedJobsPage}>
      <h2 className={styles.heading}>My Applied Jobs</h2>
      <div className={styles.jobGrid}>
        {data?.getAppliedJobs.length > 0 ? (
          data.getAppliedJobs.map(({ id, job,clientName ,status}) => (
            <div key={id} className={styles.jobCard}>
              <h4>{job.title}</h4>
              <p><strong>Client: </strong> {clientName}</p>
              <p><strong>Domain: </strong> {job.domain}</p>
              <p><strong>Status: </strong>{status}</p>
            </div>
          ))
        ) : (
          <p className={styles.noJobs}>You haven't applied for any jobs yet.</p>
        )}
      </div>
       <button className={styles.backButton} onClick={() => navigate(-1)}>
              Back
        </button>
    </div>
  );
};

export default Applications;
