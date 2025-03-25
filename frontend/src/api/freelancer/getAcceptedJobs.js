import { gql } from "@apollo/client";
export const GET_ACCEPTED_PROJECTS = gql`
  query GetAcceptedProjects($freelancerId: ID!) {
    getAcceptedProjects(freelancerId: $freelancerId) {
      id
      job {
        id
        title
        domain
      }
      clientName
    }
  }
`;

export default GET_ACCEPTED_PROJECTS;