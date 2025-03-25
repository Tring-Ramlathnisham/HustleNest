import { gql } from "@apollo/client";
const REJECT_JOB_PROPOSALS = gql`
  mutation RejectProposal($proposalId: ID!) {
    rejectProposal(proposalId: $proposalId) {
      job{
      id
      }  
      status  
    }
  }
`;

export default REJECT_JOB_PROPOSALS;