import { gql } from "@apollo/client";
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

export default ACCEPT_JOB_PROPOSALS;