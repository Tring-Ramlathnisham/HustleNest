import { gql } from "@apollo/client";
const REGISTER_MUTATION = gql`
  mutation Register($name:String!,$email:String!,$password:String!,$role:String!) {
    register(name:$name,email:$email,password:$password,role:$role) {
      id
      name
      email
      role
      token
    }
  }
`;
export default REGISTER_MUTATION;