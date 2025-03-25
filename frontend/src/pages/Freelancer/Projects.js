import React from "react";
import { gql ,useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
//import { GET_ACCEPTED_PROJECTS } from "../../graphql/queries"; 
import styles from "./Applications.module.css"; 


export const GET_ACCEPTED_PROJECTS = gql`
  query GetAcceptedProjects($freelancerId: ID!) {
    getAcceptedProjects(freelancerId: $freelancerId) {
      id
      job {
        id
        title
        domain
      }
      clientName
    }
  }
`;


const AcceptedProjects = () => {
  const user = useSelector((state) => state.auth?.user);
  const freelancerId = user?.id || null;

  const { data, loading, error } = useQuery(GET_ACCEPTED_PROJECTS, {
    variables: freelancerId ? { freelancerId: freelancerId.toString() } : null,
    skip: !freelancerId,
    fetchPolicy:"network-only",
  });

  if (loading) return <p>Loading accepted projects...</p>;
  if (error) return <p>Error fetching accepted projects.</p>;

  return (
    <div className={styles.appliedJobsPage}>
      <h2 className={styles.heading}>My Accepted Projects</h2>
      <div className={styles.jobGrid}>
        {data?.getAcceptedProjects.length > 0 ? (
          data.getAcceptedProjects.map(({ id, job, clientName }) => (
            <div key={id} className={styles.jobCard}>
              <h4>{job.title}</h4>
              <p><strong>Client:</strong> {clientName}</p>
              <p><strong>Domain:</strong> {job.domain}</p>
            </div>
          ))
        ) : (
          <p className={styles.noJobs}>You have no accepted projects yet.</p>
        )}
      </div>
      <button className={styles.backButton} onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
};

export default AcceptedProjects;
