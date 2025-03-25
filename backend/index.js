import express from "express";
import {mergeTypeDefs,mergeResolvers} from '@graphql-tools/merge'
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import userTypeDef from "./graphql/User/userTypeDefs.js";
import userResolvers from "./graphql/User/userResolvers.js";
import clientResolvers from "./graphql/Client/clientResolvers.js";
import clientTypeDefs from "./graphql/Client/clientTypeDefs.js";
import freelancerResolvers from "./graphql/Freelancer/freelancerResolvers.js";
import freelancerTypeDefs from "./graphql/Freelancer/freelancerTypeDefs.js";
import createContext from "./Middleware/Auth.js";





const app = express();
app.use(cors()); //{origin:"http://localhost:3000",credentials:true}


const typeDefs=mergeTypeDefs([userTypeDef,clientTypeDefs,freelancerTypeDefs]);
const resolvers=mergeResolvers([userResolvers,clientResolvers,freelancerResolvers]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext, 
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log(`Server running at http://localhost:5000${server.graphqlPath}`);
  });
}

startServer();
