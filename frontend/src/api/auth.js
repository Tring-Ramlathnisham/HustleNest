import { gql } from "@apollo/client";
import client from "./apolloClient";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!, $role: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      token
      role
    }
  }
`;

export const fetchLogin = async (credentials) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: credentials,
    });
    return data.login;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
};

export const registerUser = async (userData) => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation register($name: String!, $email: String!, $password: String!, $role: String!) {
          register(name: $name, email: $email, password: $password, role: $role) {
            id
            name
            email
            role
            token
          }
        }
      `,
      variables: userData,
    });
    return data.register;
  };