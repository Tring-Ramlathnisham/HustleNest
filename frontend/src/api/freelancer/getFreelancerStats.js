import { gql } from "@apollo/client";
const GET_FREELANCER_STATS = gql`
  query GetFreelancerDashboardStats($freelancerId: ID!) {
    getFreelancerDashboardStats(freelancerId: $freelancerId) {
      totalJobsApplied
      totalProposalsPending
      totalProjectsAccepted
    }
  }
`;
export default GET_FREELANCER_STATS;