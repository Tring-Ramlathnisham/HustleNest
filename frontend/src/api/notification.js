import { gql } from "@apollo/client";
import client from "./apolloClient";

const GET_NOTIFICATIONS_QUERY = gql`
  query GetNotifications {
    notifications {
      id
      message
      createdAt
    }
  }
`;

export const fetchNotificationsAPI = async () => {
  try {
    const { data } = await client.query({ query: GET_NOTIFICATIONS_QUERY });
    return data.notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
