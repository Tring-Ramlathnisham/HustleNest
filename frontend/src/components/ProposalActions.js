import React from "react";
import styles from "./ProposalActions.module.css";
import { useNavigate } from "react-router-dom";

const ProposalActions = ({ proposalId, status, onAccept, onReject, showReject = true ,showClose=false}) => {
  const isAccepted = status === "accepted";
  const isRejected = status === "rejected";
  const navigate=useNavigate();

  return (
    <div className={styles.buttonGroup}>
      {/* Accept Button */}
      <button
        className={`${styles.button} ${styles.acceptBtn}`}
        onClick={(event) => onAccept(event, proposalId)}
        disabled={isAccepted || isRejected} 
      >
        {isAccepted ? "Accepted" : "Accept"}
      </button>

      {/* Reject Button */}
      {showReject && (
        <button
          className={`${styles.button} ${styles.rejectBtn}`}
          onClick={(event) => onReject(event, proposalId)}
          disabled={isRejected || isAccepted} 
        >
          {isRejected ? "Rejected" : "Reject"}
        </button>
      )}

      {/* Close Button */}
      {showClose && (
        <button className={`${styles.button} ${styles.closeBtn}`} onClick={() => navigate(-1)}>
          Close
        </button>
      )}
    </div>
  );
};

export default ProposalActions;
