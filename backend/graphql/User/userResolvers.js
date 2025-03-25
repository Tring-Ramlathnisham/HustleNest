import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/database.js";

const userResolvers={
    Mutation:{
      register: async (_, { name, email, password, role }) => {
          const hashedPassword = await bcrypt.hash(password, 10);
          const existsAccount=await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
          if(existsAccount.rows.length==0){
          const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, role]
          );
    
          const user = result.rows[0];
          const token = jwt.sign({ id: user.id,role:user.role,email:user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
          return { ...user, token };
        }
        else{
          throw new Error('Already Have an account with this email..');
        }
        },
        
              login: async (_, { email, password }) => {
                const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
                const user = result.rows[0];
        
                if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error("Invalid credentials");
                }
        
                const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
                return { ...user, token };
            },
            
    }
}
export default userResolvers;