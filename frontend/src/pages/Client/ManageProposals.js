import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import ProposalActions from "../../components/ProposalActions"; 
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
      job{
      id
      }
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

  const [acceptProposal] = useMutation(ACCEPT_JOB_PROPOSALS, {
    refetchQueries: [{ query: GET_JOB_PROPOSALS, variables: { jobId } ,fetchPolicy:"network-only",}],
  });


  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p>Error loading proposals</p>;

  return (
    <div className={styles.manageProposalsPage}>
      <div className={styles.proposalContainer}>
        <h3 className={styles.proposalTitle}>Proposals for Job</h3>

        {!data.proposals || data.proposals.length === 0 ? (
          <p className={styles.noProposals}>No proposals received for this job</p>
        ) : (
          <ul className={styles.proposalList}>
            {data.proposals.map((proposal) => (
              <li key={proposal.id} className={styles.proposalItem} onClick={()=>navigate(`/client/proposalDetails/${proposal.id}`)}>
                <p className={styles.proposalText}><strong>{proposal.freelancer.name}</strong> - ${proposal.proposedBudget}</p>
                
                <ProposalActions
                  proposalId={proposal.id}
                  status={proposal.status}
                  onAccept={() => acceptProposal({ variables: { proposalId: proposal.id } })}
                  showReject={false}
                />
              </li>
            ))}
          </ul>
        )}
         <button className={styles.backButton} onClick={() => navigate(-1)}>Back</button>
    </div>
     
    </div>
  );
};

export default ManageProposals;
