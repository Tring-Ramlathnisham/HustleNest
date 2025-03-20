import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProposalDetails.module.css";

const GET_PROPOSAL_DETAILS = gql`
  query getProposal($proposalId: ID!) {
    proposal(proposalId: $proposalId) {
      freelancer {
        name
        email
      }
      coverLetter
      proposedBudget
    }
  }
`;

const ProposalDetails = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_PROPOSAL_DETAILS, {
    variables: { proposalId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error:",error);
    return <p>Error loading proposal details</p>;} 

  return (
    <div className={styles.proposalDetails}>
      <h3>Proposal Details</h3>
      <p><strong>Freelancer:</strong> {data.proposal.freelancer.name}</p>
      <p><strong>Cover Letter:</strong> {data.proposal.coverLetter}</p>
      <p><strong>Budget:</strong> ${data.proposal.proposedBudget}</p>
      <button onClick={() => navigate(-1)}>Close</button>
      <button className={styles.acceptBtn}>Accept</button>
      <button className={styles.rejectBtn}>Reject</button>
    </div>
  );
};

export default ProposalDetails;
