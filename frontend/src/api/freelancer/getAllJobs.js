import { gql } from "@apollo/client";
const GET_ALL_JOBS = gql`
  query GetAllJobs {
    jobs {
      id
      title
      description
      domain
      budget
      client {
        name
      }
    }
  }
`;

export default GET_ALL_JOBS;