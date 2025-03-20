import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ManageProposals.module.css";

const GET_JOB_PROPOSALS = gql`
  query Proposals($jobId: ID!) {
    proposals(jobId: $jobId) {
      id
      freelancer {
        name
      }
      proposedBudget
    }
  }
`;

const ManageProposals = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_JOB_PROPOSALS, {
    variables: { jobId },
  });

  if (loading) return <p>Loading proposals...</p>;
  if (error) {
    console.log("Error:",error);
    return <p>Error loading proposals</p>;
  }
    

  return (
    <div className={styles.proposalContainer}>
      <h3>Proposals for Job</h3>
  
      {/* Conditional Rendering for No Proposals */}
      {!data.proposals || data.proposals.length === 0 ? (
        <p>No proposals received for this job</p>
      ) : (
        <ul>
          {data.proposals.map((proposal) => (
            <li
              key={proposal.id}
              className={styles.proposalItem}
              onClick={() => navigate(`/client/proposalDetails/${proposal.id}`)}
            >
              <p>
                <strong>{proposal.freelancer.name}</strong> - ${proposal.proposedBudget}
              </p>
              <button className={styles.acceptBtn}>Accept</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default ManageProposals;
