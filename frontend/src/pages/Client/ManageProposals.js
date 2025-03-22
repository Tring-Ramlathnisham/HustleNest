import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
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
      status
    }
  }
`;

const ACCEPT_JOB_PROPOSALS = gql`
  mutation AcceptProposal($proposalId: ID!) {
    acceptProposal(proposalId: $proposalId) {
      id
      status
    }
  }
`;

const ManageProposals = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_JOB_PROPOSALS, {
    variables: { jobId },
  });

  const [acceptedProposalId, setAcceptedProposalId] = useState(null);

  const [acceptProposal, { loading: acceptLoading, error: acceptError }] =
    useMutation(ACCEPT_JOB_PROPOSALS, {
      refetchQueries: [{ query: GET_JOB_PROPOSALS, variables: { jobId } }],
      onCompleted: (response) => {
        setAcceptedProposalId(response.acceptProposal.id);
      },
      onError: (err) => {
        console.error("Error accepting proposal:", err);
        alert("Failed to accept the proposal. Try again.");
      },
    });

  const handleAcceptProposal = async (event, proposalId) => {
    event.stopPropagation(); // Prevent navigating when clicking the button
    console.log("Clicked accept button in the manage proposal page.");

    if (window.confirm("Are you sure you want to accept this proposal?")) {
      try {
        await acceptProposal({ variables: { proposalId } });
        alert("Proposal accepted successfully!");
      } catch (err) {
        console.error("Proposal acceptance error:", err);
      }
    }
  };

  if (loading) return <p>Loading proposals...</p>;
  if (error) {
    console.log("Error:", error);
    return <p>Error loading proposals</p>;
  }

  // Check if any proposal has already been accepted
  const hasAcceptedProposal = data.proposals.some(
    (proposal) => proposal.status === "accepted" || proposal.id === acceptedProposalId
  );

  return (
    <div className={styles.manageProposalsPage}>
      <div className={styles.proposalContainer}>
        <h3 className={styles.proposalTitle}>Proposals for Job</h3>

        {/* Conditional Rendering for No Proposals */}
        {!data.proposals || data.proposals.length === 0 ? (
          <p className={styles.noProposals}>No proposals received for this job</p>
        ) : (
          <ul className={styles.proposalList}>
            {data.proposals.map((proposal) => {
              const isAccepted = proposal.status === "accepted" || proposal.id === acceptedProposalId;

              return (
                <li
                  key={proposal.id}
                  className={styles.proposalItem}
                  onClick={() => navigate(`/client/proposalDetails/${proposal.id}`)}
                >
                  <p className={styles.proposalText}>
                    <strong>{proposal.freelancer.name}</strong> - ${proposal.proposedBudget}
                  </p>
                  <button
                    className={styles.acceptBtn}
                    onClick={(event) => handleAcceptProposal(event, proposal.id)}
                    disabled={hasAcceptedProposal} // Disable all buttons if one proposal is accepted
                  >
                    {isAccepted ? "Accepted" : "Accept"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {acceptError && <p className={styles.errorMessage}>Error: {acceptError.message}</p>}
      </div>
    </div>
  );
};

export default ManageProposals;
