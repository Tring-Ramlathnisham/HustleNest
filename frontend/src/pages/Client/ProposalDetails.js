import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProposalDetails.module.css";

const GET_PROPOSAL_DETAILS = gql`
  query getProposal($proposalId: ID!) {
    proposal(proposalId: $proposalId) {
      id  
      freelancer {
        name
        email
      }
      coverLetter
      proposedBudget
      status  # ✅ Fetch proposal status to disable buttons conditionally
    }
  }
`;

const REJECT_JOB_PROPOSALS = gql`
  mutation RejectProposal($proposalId: ID!) {
    rejectProposal(proposalId: $proposalId) {
      id  
      status  
    }
  }
`;

const ProposalDetails = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_PROPOSAL_DETAILS, {
    variables: { proposalId },
    fetchPolicy: "network-only", // ✅ Ensures we get fresh data
  });

  const [rejectProposal, { loading: rejectLoading }] = useMutation(REJECT_JOB_PROPOSALS, {
    variables: { proposalId },
    refetchQueries: [{ query: GET_PROPOSAL_DETAILS, variables: { proposalId } }], // ✅ Auto-refresh the query
    onCompleted: (response) => {
      if (response?.rejectProposal?.status === "rejected") {
        alert("Proposal rejected successfully!");
      }
    },
    onError: (err) => {
      console.error("Error rejecting proposal:", err);
      alert("Failed to reject the proposal. Try again.");
    },
  });

  const handleRejectProposal = async (event) => {
    event.stopPropagation();

    if (window.confirm("Are you sure you want to reject this proposal?")) {
      try {
        await rejectProposal();
        console.log("Returned Data:",rejectProposal);
      } catch (err) {
        console.error("Proposal rejection error:", err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error:", error);
    return <p>Error loading proposal details</p>;
  }

  const isRejected = data.proposal.status === "rejected";

  return (
    <div className={styles.proposalDetailPage}>
      <div className={styles.proposalDetails}>
        <h3 className={styles.proposalTitle}>Proposal Details</h3>
        <p className={styles.proposalDetail}>
          <strong>Freelancer:</strong> <br /><br />
          <span className={styles.details}>{data.proposal.freelancer.name}</span>
        </p>
        <p className={styles.proposalDetail}>
          <strong>Cover Letter:</strong> <br /><br />
          <span className={styles.details}>{data.proposal.coverLetter}</span>
        </p>
        <p className={styles.proposalDetail}>
          <strong>Budget:</strong> <br /><br />
          <span className={styles.details}>${data.proposal.proposedBudget}</span>
        </p>

        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.closeBtn}`} onClick={() => navigate(-1)}>
            Close
          </button>
          <button 
            className={`${styles.button} ${styles.acceptBtn}`} 
            disabled={isRejected} // ✅ Disable Accept button if rejected
          >
            Accept
          </button>
          <button
            className={`${styles.button} ${styles.rejectBtn}`}
            onClick={handleRejectProposal}
            disabled={isRejected || rejectLoading}  // ✅ Disable Reject button after rejection
          >
            {isRejected ? "Rejected" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
