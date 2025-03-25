import { gql } from "@apollo/client";
const POST_JOB_MUTATION = gql`
  mutation PostJob($title: String!, $description: String!, $budget: Float!, $domain: String!) {
    postJob(title: $title, description: $description, budget: $budget, domain: $domain) {
      id
      title
      description
      budget
      domain
    }
  }
`;

export default POST_JOB_MUTATION;