import { gql } from "@apollo/client";

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

export default GET_JOB_PROPOSALS;