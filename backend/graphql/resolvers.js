import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";


const fetchJobById = async (jobId) => {
    try {
        const result = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
        if (result.rows.length === 0) {
            console.error(`Error: No job found for job ID: ${jobId}`);
            throw new Error("Job not found");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching job:", error);
        throw new Error("Internal Server Error while fetching job");
    }
};

const fetchUserById = async (userId) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
        if (result.rows.length === 0) {
            console.error(`Error: No user found for user ID: ${userId}`);
            throw new Error("User not found");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Internal Server Error while fetching user");
    }
};


const resolvers = {
    Query: {
      users: async () => {
        const result = await pool.query("SELECT * FROM users");
        return result.rows;
      },
  
      jobs: async () => {
        const result = await pool.query("SELECT * FROM jobs where status='open'");
        return result.rows;
      },
  
      proposals: async (_, { jobId }) => {
        const result = await pool.query(`SELECT * FROM proposals WHERE "jobId" = $1`, [jobId]);
        return result.rows;
      },
      getJobs: async (_, { domain }) => {
        let query = `SELECT * FROM jobs WHERE status = 'open'`;
        let values = [];
    
        if (domain) {
            query += ` AND domain = $1`;
            values.push(domain);
        }
    
        const result = await pool.query(query, values);
        return result.rows;
    },
      projects: async () => {
        const result = await pool.query("SELECT * FROM projects");
        return result.rows;
      },

      getClientDashboardStats:async(_,{clientId})=>{

        try{
          //console.log("fetching client id in resolver:",clientId);
        const totalJobs=await pool.query(`SELECT COUNT(*) FROM jobs WHERE "clientId"= $1`,[clientId]);

       // console.log("Total jobs:",totalJobs.rows[0]);
        const totalProposals=await pool.query(`SELECT COUNT(*) FROM proposals WHERE "jobId" IN (SELECT id FROM jobs WHERE "clientId"=$1)`,[clientId]);
       // console.log("Total proposals:",totalProposals.rows[0]);
        const activeProjects=await pool.query(`SELECT COUNT(*) FROM jobs WHERE "clientId"=$1 AND status='in progress'`,[clientId]); 
        //console.log("Active projects:",activeProjects.rows[0]);
        const jobs=await pool.query(
          `SELECT j.id,j.title,(SELECT COUNT(*) FROM proposals p WHERE p."jobId"=j.id) AS "proposalCount"
           FROM jobs j
           WHERE j."clientId"=$1`,
           [clientId]
         //Select id,title from jobs where "clientId"=$1`,[clientId] 
           
        );
     
        return {
          totalJobs:parseInt(totalJobs.rows[0].count),
          totalProposals:parseInt(totalProposals.rows[0].count),
          activeProjects:parseInt(activeProjects.rows[0].count),
          jobs:jobs.rows,
        };
      }
      catch(error){
        console.error("Error fetching client dashboard stats:",error);
        throw new Error("Failed to fetch client dashboard stats");
      }
      },
      proposal:async(_,{proposalId})=>{
        try {
          const proposalQuery=`Select * from proposals where id=$1`;
          const  result = await pool.query(proposalQuery, [proposalId]);
  
          if (result.rows.length === 0) {
            throw new Error("Proposal not found");
          }
  
          return result.rows[0];
         
        } catch (error) {
          console.error(error);
          throw new Error("Failed to fetch proposal details");
        }
      },

      getFreelancerDashboardStats:async(_,{freelancerId})=>{

        try{
          const totalJobsApplied=await pool.query(`select count(*) from proposals where "freelancerId"=$1`,[freelancerId]);
          const totalProposalsPending=await pool.query(`select count(*) from proposals where "freelancerId"=$1 and status='pending'`,[freelancerId]);
          const totalProjectsAccepted=await pool.query(`select count(*) from proposals where "freelancerId"=$1 and status='accepted'`,[freelancerId]);

          return {
            totalJobsApplied:parseInt(totalJobsApplied.rows[0].count),
            totalProposalsPending:parseInt(totalProposalsPending.rows[0].count),
            totalProjectsAccepted:parseInt(totalProjectsAccepted.rows[0].count),
          };
        }
        catch(error){
          console.error("Error fetching freelancer dashboard statistics:",error);
          throw new Error("Failed to fetch freelancer dashboard statistics");
        }
      
      },
      getAppliedJobs: async (_, { freelancerId }) => {
        try {
          // console.log("Fetching applied jobs for freelancerId:", freelancerId);
      
          if (!freelancerId) {
            throw new Error("Freelancer ID is missing");
          }
      
          const getAppliedJobs = await pool.query(`
            SELECT 
              j.id AS "jobId", 
              j.title, 
              j.domain,  
              u.name AS "clientName",
              p.status AS "status"
            FROM proposals p
            JOIN jobs j ON j.id = p."jobId"
            JOIN users u ON u.id = j."clientId"
            WHERE p."freelancerId" = $1;
          `, [freelancerId]);
      
          // console.log("DB Result:", getAppliedJobs.rows);
      
          // If no applied jobs found, return an empty array
          if (getAppliedJobs.rows.length === 0) {
            console.log("No applied jobs found for this freelancer.");
            return [];
          }
      
          return getAppliedJobs.rows.map(row => ({
            id: row.jobId,  
            job: {
              id: row.jobId,
              title: row.title,
              domain: row.domain
            },
            clientName:  row.clientName,
            status:row.status
          }));
      
        } catch (error) {
          console.error(" Error fetching applied jobs:", error.message);
          throw new Error("Failed to fetch applied jobs");
        }
      },

      getAcceptedProjects: async (_, { freelancerId }) => {
        try {
          console.log("Fetching accepted projects for freelancerId:", freelancerId);
      
          if (!freelancerId) {
            throw new Error("Freelancer ID is missing");
          }
      
          const acceptedProjects = await pool.query(`
            SELECT 
              j.id AS "jobId", 
              j.title, 
              j.domain,  
              u.name AS "clientName"
            FROM proposals p
            JOIN jobs j ON j.id = p."jobId"
            JOIN users u ON u.id = j."clientId"
            WHERE p."freelancerId" = $1 AND p.status = 'accepted';
          `, [freelancerId]);
      
          console.log("DB Result:", acceptedProjects.rows);
      
          return acceptedProjects.rows.map(row => ({
            id: row.jobId,
            job: {
              id: row.jobId,
              title: row.title,
              domain: row.domain
            },
            clientName: row.clientName
          }));
      
        } catch (error) {
          console.error("Error fetching accepted projects:", error.message);
          throw new Error("Failed to fetch accepted projects");
        }
      },
      
      
    },
  
    Mutation: {
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
  
      postJob: async (_, { title, description, budget, domain }, { user }) => {
        console.log('user:',user);
        if (!user || user.role !== "client") throw new Error("Not authorized");
      
        const client = await pool.connect(); // Get a client connection
        try {
          await client.query("BEGIN"); // Start transaction
      
          const result = await client.query(
            `INSERT INTO jobs ("clientId", title, description, budget, domain) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user.id, title, description, budget, domain]
          );
      
          await client.query("COMMIT"); // Commit transaction
          return result.rows[0];
        } catch (error) {
          await client.query("ROLLBACK"); // Rollback transaction on error
          throw new Error("Failed to post job: " + error.message);
        } finally {
          client.release(); // Release client connection
        }
      },
      
      applyJob: async (_, { jobId, coverLetter, proposedBudget }, { user }) => {
        console.log('user:',user);
        if (!user) {
          throw new Error("Authentication required to apply for jobs");
        }
        if (user.role !== "freelancer") {
            throw new Error(" Only freelancers can apply for jobs");
        }
    
        try {
            const result = await pool.query(
                `INSERT INTO proposals ("jobId", "freelancerId", "coverLetter", "proposedBudget", status, "submittedAt") 
                 VALUES ($1, $2, $3, $4, 'pending', NOW()) RETURNING *`,
                [jobId, user.id, coverLetter, proposedBudget]
            );
    
            if (result.rows.length === 0) {
                console.error("ERROR: Proposal insertion failed!");
                throw new Error("Proposal insertion failed");
            }
    
            const proposal = result.rows[0];
    
            return proposal;
        } catch (error) {
            console.error(" ERROR Applying for Job:", error);
            throw new Error(" Internal Server Error while applying for job.");
        }
    },
    
      
    acceptProposal: async (_, { proposalId }, { user }) => {
      if (!user) {
        throw new Error("Authentication required to accept the proposal.");
      }
      if (user.role !== "client") {
        throw new Error("Unauthorized: Only clients can accept proposals.");
      }
    
      const client = await pool.connect();
      
      try {
        await client.query("BEGIN");
    
        // Check if the job is already assigned
        const alreadyAccepted = await client.query(
          `SELECT * FROM projects WHERE "jobId" = (SELECT "jobId" FROM proposals WHERE id = $1)`,
          [proposalId]
        );
    
        if (alreadyAccepted.rows.length > 0) {
          await client.query("ROLLBACK");
          throw new Error("This job is already assigned to someone else.");
        }
    
        // Fetch proposal and job details
        const proposalResult = await client.query(
          `SELECT p.*, j."clientId" 
           FROM proposals p
           JOIN jobs j ON p."jobId" = j.id
           WHERE p.id = $1`,
          [proposalId]
        );
    
        const proposal = proposalResult.rows[0];
    
        if (!proposal) {
          throw new Error("Proposal not found.");
        }
        if (proposal.clientId !== user.id) {
          throw new Error("Unauthorized: You can only accept proposals for your own jobs.");
        }
    
        // Mark the selected proposal as "accepted"
        await client.query(
          `UPDATE proposals SET status = 'accepted' WHERE id = $1`,
          [proposalId]
        );
    
        // Mark all other proposals for the same job as "rejected"
        await client.query(
          `UPDATE proposals SET status = 'rejected' WHERE "jobId" = $1 AND id != $2`,
          [proposal.jobId, proposalId]
        );
    
        // Mark the job status as in-progress
        await client.query(
          `UPDATE jobs SET status = 'in progress' WHERE id = $1`,
          [proposal.jobId]
        );
    
        // Ensure freelancerId is not null before inserting into projects
        if (!proposal.freelancerId) {
          await client.query("ROLLBACK");
          throw new Error("Proposal is missing freelancer information.");
        }
    
        // Insert into projects
        const projectResult = await client.query(
          `INSERT INTO projects ("jobId", "freelancerId", "clientId", "status", "deadline") 
           VALUES ($1, $2, $3, 'in progress', NOW() + INTERVAL '30 days') 
           RETURNING *`,
          [proposal.jobId, proposal.freelancerId, proposal.clientId]
        );
    
        await client.query("COMMIT");
    
        return projectResult.rows[0];
    
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in acceptProposal:", error);
        throw new Error("Failed to accept the proposal.");
      } finally {
        client.release();
      }
    },
    
  
  rejectProposal:async(_,{proposalId},{user})=>{
    if (!user) {
      throw new Error("Authentication required to accept the proposals");
    }
    if (user.role !== "client") {
        throw new Error(" Unauthorized: Only clients can accept the proposals");
    }
    const client = await pool.connect(); 
    try {
      await client.query("BEGIN");
      const proposalResult = await client.query(`
        SELECT p.*, j."clientId" 
        FROM proposals p
        JOIN jobs j ON p."jobId" = j.id
        WHERE p.id = $1
    `, [proposalId]);

    const proposal = proposalResult.rows[0];

    if (!proposal) {
        throw new Error("Proposal not found");
    }
    if (proposal.clientId !== user.id) {
      throw new Error(" Unauthorized: You can only accept proposals for your own jobs");
    }
    await client.query(
      `UPDATE proposals SET status = 'rejected' WHERE id = $1`,
      [proposalId]
    );
    await client.query("COMMIT");
    const return_result=await client.query(`Select * from proposals where id=$1`,[proposalId]);
    return return_result.rows[0];

    }
    catch(error){
      await client.query("ROLLBACK"); 
      console.error(" Error in upadte status:", error);
      throw new Error("Failed to reject the proposal");
    }
    finally {
      client.release(); 
    }
  },
  
  updateProjectStatus: async (_, { projectId, status }, { user }) => {
    //  Authentication: Ensure user is logged in
    if (!user) {
        throw new Error(" Authentication required to update project status");
    }

    //  Get the project details along with the job title
    const projectResult = await pool.query(
        `SELECT p.*, j.title AS jobTitle FROM projects p 
         JOIN jobs j ON p."jobId" = j.id WHERE p.id = $1`,
        [projectId]
    );

    const project = projectResult.rows[0];

    if (!project) {
        throw new Error(" Project not found");
    }

    //  Authorization: Only freelancers assigned to the project can update status
    if (project.freelancerId !== user.id) {
        throw new Error(" Unauthorized: Only the assigned freelancer can update project status");
    }

    const client = await pool.connect(); // Start a transaction
    try {
        await client.query("BEGIN");

        //  Update the project status
        const updatedProjectResult = await client.query(
            `UPDATE projects SET status = $1 WHERE id = $2 RETURNING *`,
            [status, projectId]
        );

        const updatedProject = updatedProjectResult.rows[0];

        //  Create a notification for the client with the project title
        await client.query(
            `INSERT INTO notifications ("userId", "message", "createdAt") 
             VALUES ($1, $2, NOW())`,
            [project.clientId, `Project "${project.jobTitle}" status updated to '${status}'`]
        );

        await client.query("COMMIT");

        return updatedProject;
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(" Error in updateProjectStatus:", error.message);
        throw new Error("Failed to update project status");
    } finally {
        client.release();
    }
    },
  },

    Proposal:{
       job:(parent)=>fetchJobById(parent.jobId),
       freelancer:(parent)=>fetchUserById(parent.freelancerId),
    },
    Project:{
        job:(parent)=>fetchJobById(parent.jobId),
        freelancer:(parent)=>fetchUserById(parent.freelancerId),
    },
    Job:{
      proposalCount:async(parent)=>{
        const result=await pool.query(`Select Count(*) from proposals where "jobId"=$1`,[parent.id]);
        return parseInt(result.rows[0].count,10);
      },
      client:(parent)=>fetchUserById(parent.clientId),
    },
      
  };
  
  export default resolvers;
  