import {gql} from 'apollo-server-express';

const userTypeDef = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    token: String
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    role: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }


  type Mutation {
    register(name:String!,email:String!,password:String!,role:String!): User
    login(email:String!,password:String!):User
  }
`;

export default userTypeDef;
