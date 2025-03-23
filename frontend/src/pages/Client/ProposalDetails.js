import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams} from "react-router-dom";
import ProposalActions from "../../components/ProposalActions"; // ✅ Import reusable component
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
      status  
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

const ACCEPT_JOB_PROPOSALS = gql`
  mutation AcceptProposal($proposalId: ID!) {
    acceptProposal(proposalId: $proposalId) {
      id
      status
    }
  }
`;

const ProposalDetails = () => {
  const { proposalId } = useParams();

  const { data, loading, error } = useQuery(GET_PROPOSAL_DETAILS, {
    variables: { proposalId },
    fetchPolicy: "network-only",
  });

  const [acceptProposal] = useMutation(ACCEPT_JOB_PROPOSALS, {
    variables: { proposalId },
    refetchQueries: [{ query: GET_PROPOSAL_DETAILS, variables: { proposalId } }],
    onError:(err)=>{
      console.error("Error in accepting proposal:",err);
      alert("Failed to accept the proposal,Try Again");
    }
  });

  const handleAcceptProposal=async(event)=>{
    event.stopPropogation();
    if(window.confirm("Are you sure you want to accept this proposal?")){
      try{
        await acceptProposal();
        alert("Proposal accepted successfully!");
      }
      catch(error){
        console.error("Proposal acceptance error:",error);
      }
    }

  }

  const [rejectProposal] = useMutation(REJECT_JOB_PROPOSALS, {
    variables: { proposalId },
    refetchQueries: [{ query: GET_PROPOSAL_DETAILS, variables: { proposalId } }],
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
  if (error) return <p>Error loading proposal details</p>;

  return (
    <div className={styles.proposalDetailPage}>
      <div className={styles.proposalDetails}>
        <h3 className={styles.proposalTitle}>Proposal Details</h3>
        <p className={styles.proposalDetail}>
          <strong>Freelancer:</strong> <br/><br/>
          <span className={styles.details}>{data.proposal.freelancer.name}</span>
        </p>
        <p className={styles.proposalDetail}>
          <strong>Cover Letter:</strong><br/><br/>
          <span className={styles.details}>{data.proposal.coverLetter}</span> 
        </p>
        <p className={styles.proposalDetail}>
          <strong>Budget:</strong><br/><br/>
          <span className={styles.details}>${data.proposal.proposedBudget}</span> 
        </p>
      <div className={styles.buttonGroup}>
        <ProposalActions
          proposalId={data.proposal.id}
          status={data.proposal.status}
          onAccept={(event) => handleAcceptProposal(event)}
          onReject={(event) => handleRejectProposal(event)}
          showReject={true} 
          showClose={true}
        />
      </div>
    </div>
  </div>
  );
};

export default ProposalDetails;
