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
    proposalCount:Int!
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

  type ClientDashboardStats{
    totalJobs:Int!
    totalProposals:Int!
    activeProjects:Int!
    jobs:[Job!]!
  }

  type FreelancerDashboardStats{
    totalJobsApplied:Int!
    totalProposalsPending:Int!
    totalProjectsAccepted:Int!
  }

  type AppliedJob {
  id: ID!
  job: Job!
  clientName: String!
  status:String
  }
  
  type Query {
    users: [User]
    jobs: [Job]
    proposals(jobId: ID!): [Proposal]
    getJobs(domain:String):[Job]
    projects: [Project]
    getClientDashboardStats(clientId: ID!): ClientDashboardStats
    proposal(proposalId:ID!):Proposal
    getFreelancerDashboardStats(freelancerId:ID!):FreelancerDashboardStats
    getAppliedJobs(freelancerId:ID!):[AppliedJob!]!
    getAcceptedProjects(freelancerId:ID!):[AppliedJob!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String!): User
    login(email: String!, password: String!): User
    postJob(title: String!, description: String!, budget: Float!,domain:String!): Job
    applyJob(jobId: ID!, coverLetter: String!, proposedBudget: Float!): Proposal
    acceptProposal(proposalId: ID!): Project
    rejectProposal(proposalId:ID!):Proposal
    updateProjectStatus(projectId: ID!, status: String!): Project
  }
`;

export default typeDefs;

