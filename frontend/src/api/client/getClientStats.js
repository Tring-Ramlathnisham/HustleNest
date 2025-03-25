import { gql } from "@apollo/client";
const GET_CLIENT_STATS = gql`
  query GetClientDashboardStats($clientId: ID!) {
    getClientDashboardStats(clientId: $clientId) {
      totalJobs
      totalProposals
      activeProjects
      jobs {
        id
        title
        proposalCount
      }
    }
  }
`;

export default GET_CLIENT_STATS;