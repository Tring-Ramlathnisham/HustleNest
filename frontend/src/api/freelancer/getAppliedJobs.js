import { gql } from "@apollo/client";
const GET_APPLIED_JOBS = gql`
  query GetAppliedJobs($freelancerId: ID!) {
    getAppliedJobs(freelancerId: $freelancerId) {
      id

      job {
        id
        title
        domain
      }
      clientName
      status
    }
  }
`;

export default GET_APPLIED_JOBS;