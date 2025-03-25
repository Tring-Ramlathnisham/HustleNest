import { gql } from "@apollo/client";
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      role
      email
      token
    }
  }
`;

export default LOGIN_MUTATION;