import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    token: String
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    budget: Float!
    status: String!
    domain:String!
    client: User!
  }

  type Proposal {
    id: ID!
    job: Job!
    freelancer: User!
    coverLetter: String!
    proposedBudget: Float!
    status: String!
  }

  type Project {
    id: ID!
    job: Job!
    freelancer: User!
    client: User!
    status: String!
    deadline: String!
  }

  type Query {
    users: [User]
    jobs: [Job]
    proposals(jobId: ID!): [Proposal]
    getJobs(domain:String):[Job]
    projects: [Project]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String!): User
    login(email: String!, password: String!): User
    postJob(title: String!, description: String!, budget: Float!,domain:String!): Job
    applyJob(jobId: ID!, coverLetter: String!, proposedBudget: Float!): Proposal
    acceptProposal(proposalId: ID!): Project
    updateProjectStatus(projectId: ID!, status: String!): Project
  }
`;

export default typeDefs;

