import { gql } from "@apollo/client";
const GET_CLIENT_JOBS = gql`
  query GetClientJobs($clientId: ID!) {
    getClientDashboardStats(clientId: $clientId) {
      jobs {
        id
        title
        proposalCount
      }
    }
  }
`;

export default GET_CLIENT_JOBS;