import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const createContext = ({ req }) => {
    try {
      const authHeader = req.headers.authorization || "";
      
      if (!authHeader.startsWith("Bearer ")) {
        return { user: null }; 
      }
  
      const token = authHeader.split(" ")[1];
  
      if (!token) {
        return { user: null }; 
      }
  
      //  Verify token
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decodedUser };
    } catch (error) {
      console.error(" Token Verification Failed:", error.message);
      return { user: null }; 
    }
  };

export default createContext;