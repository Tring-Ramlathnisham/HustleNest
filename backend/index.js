import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

dotenv.config();

const app = express();
app.use(cors({origin:"http://localhost:3000",credentials:true}
));
//  Fix: Ensure context always returns an object
const createContext = ({ req }) => {
  try {
    const authHeader = req.headers.authorization || "";
    
    if (!authHeader.startsWith("Bearer ")) {
      return { user: null }; // No token → Allow public requests
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return { user: null }; 
    }

    // ✅ Verify token
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decodedUser };
  } catch (error) {
    console.error(" Token Verification Failed:", error.message);
    return { user: null }; // Prevent errors in resolvers
  }
};

// ✅ Ensure context is handled properly
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext, // Use function reference
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log(`Server running at http://localhost:5000${server.graphqlPath}`);
  });
}

startServer();
