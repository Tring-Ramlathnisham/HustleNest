import {gql} from "apollo-server-express";

const clientTypeDefs = gql `

type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    token: String
  }

 type Proposal {
    id: ID!
    job: Job!
    freelancer: User!
    coverLetter: String!
    proposedBudget: Float!
    status: String!
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


type ClientDashboardStats{
    totalJobs:Int!
    totalProposals:Int!
    activeProjects:Int!
    jobs:[Job!]!
  }

 type Project {
    job: Job!
    freelancer: User!
    client: User!
    status: String!
    deadline: String!
  }

type Query{
    proposals(jobId:ID!):[Proposal]
    getClientDashboardStats(clientId: ID!): ClientDashboardStats
    proposal(proposalId:ID!):Proposal
}

type Mutation{
    postJob(title: String!, description: String!, budget: Float!,domain:String!): Job
    acceptProposal(proposalId: ID!): Project
    rejectProposal(proposalId:ID!):Proposal
}
`
export default clientTypeDefs;