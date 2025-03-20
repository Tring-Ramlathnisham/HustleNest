import { gql } from "@apollo/client";
import client from "./apolloClient";

// Fetch projects
const GET_PROJECTS_QUERY = gql`
  query GetProjects {
    projects {
      id
      title
      status
      client {
        name
      }
      freelancer {
        name
      }
    }
  }
`;

export const fetchProjectsAPI = async () => {
  try {
    const { data } = await client.query({ query: GET_PROJECTS_QUERY });
    return data.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Update project status
const UPDATE_PROJECT_STATUS_MUTATION = gql`
  mutation UpdateProjectStatus($projectId: ID!, $status: String!) {
    updateProjectStatus(projectId: $projectId, status: $status) {
      id
      status
    }
  }
`;

export const updateProjectStatusAPI = async (projectId, status) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PROJECT_STATUS_MUTATION,
      variables: { projectId, status },
    });
    return data.updateProjectStatus;
  } catch (error) {
    console.error("Error updating project status:", error);
    return null;
  }
};
