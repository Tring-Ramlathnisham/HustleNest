import { gql } from "@apollo/client";
const APPLY_JOB = gql`
  mutation ApplyJob($jobId: ID!, $coverLetter: String!, $proposedBudget: Float!) {
    applyJob(jobId: $jobId, coverLetter: $coverLetter, proposedBudget: $proposedBudget) {
      id
      job {
        id
        title
      }
      freelancer {
        id
      }
    }
  }
`;
export default APPLY_JOB;