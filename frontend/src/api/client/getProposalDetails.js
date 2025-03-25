import { gql } from "@apollo/client";
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

export default GET_PROPOSAL_DETAILS;