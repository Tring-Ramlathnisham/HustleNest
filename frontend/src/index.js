import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import store from "./context/store";
import App from "./App";
import "./styles/global.css";
import client from "./api/apolloClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter> 
          <App />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
);
