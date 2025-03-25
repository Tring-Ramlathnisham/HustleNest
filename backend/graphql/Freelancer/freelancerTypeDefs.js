import {gql} from "apollo-server-express";

const freelancerTypeDefs= gql `
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

type Query{
    jobs:[Job]
    getFreelancerDashboardStats(freelancerId:ID!):FreelancerDashboardStats
    getAppliedJobs(freelancerId:ID!):[AppliedJob!]!
    getAcceptedProjects(freelancerId:ID!):[AppliedJob!]!
}

type Mutation{
    applyJob(jobId: ID!, coverLetter: String!, proposedBudget: Float!): Proposal
}

`
export default freelancerTypeDefs;