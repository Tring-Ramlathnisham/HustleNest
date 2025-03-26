import express from "express";
import {mergeTypeDefs,mergeResolvers} from '@graphql-tools/merge'
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import userTypeDef from "./graphql/user/userTypeDefs.js";
import userResolvers from "./graphql/user/userResolvers.js";
import clientResolvers from "./graphql/client/clientResolvers.js";
import clientTypeDefs from "./graphql/client/clientTypeDefs.js";
import freelancerResolvers from "./graphql/freelancer/freelancerResolvers.js";
import freelancerTypeDefs from "./graphql/freelancer/freelancerTypeDefs.js";
import createContext from "./Middleware/auth.js";


const app = express();
app.use(cors({origin:process.env.URL,credentials:true})); 

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
