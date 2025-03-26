import {pool} from "../../config/database.js";
import { fetchJobById,fetchUserById } from "../../helper/fetchHelper.js";
import verifyRole from "../../middleware/verifyRole.js";

const clientResolvers={
      Query:{
          proposals: async (_, { jobId }, { user }) => {
            await verifyRole(user, 'client');
        
            try {
                const result = await pool.query(`SELECT * FROM proposals WHERE "jobId" = $1`, [jobId]);
                return result.rows;
            } catch (error) {
                console.error("unable to fetch proposals:", error);
                throw new Error("Internal Server Error while fetching proposals");
            }
          },
    
          getClientDashboardStats:async(_,{clientId})=>{
        
                try{
                const totalJobs=await pool.query(`SELECT COUNT(*) FROM jobs WHERE "clientId"= $1`,[clientId]);
                const totalProposals=await pool.query(`SELECT COUNT(*) FROM proposals WHERE "jobId" IN (SELECT id FROM jobs WHERE "clientId"=$1)`,[clientId]);
                const activeProjects=await pool.query(`SELECT COUNT(*) FROM jobs WHERE "clientId"=$1 AND status='in progress'`,[clientId]); 

                const jobs=await pool.query(
                  `SELECT j.id,j.title,(SELECT COUNT(*) FROM proposals p WHERE p."jobId"=j.id) AS "proposalCount"
                   FROM jobs j
                   WHERE j."clientId"=$1`,
                   [clientId]
                   
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
           proposal:async(_,{proposalId},{user})=>{
              await verifyRole(user,'client');
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
        },
      Mutation:{
        postJob: async (_, { title, description, budget, domain }, { user }) => {
              await verifyRole(user,'client');
              
                const client = await pool.connect(); 
                try {
                  await client.query("BEGIN");
              
                  const result = await client.query(
                    `INSERT INTO jobs ("clientId", title, description, budget, domain) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [user.id, title, description, budget, domain]
                  );
              
                  await client.query("COMMIT"); 
                  return result.rows[0];
                } catch (error) {
                  await client.query("ROLLBACK"); 
                  throw new Error("Failed to post job: " + error.message);
                } finally {
                  client.release(); 
                }
        },
        acceptProposal: async (_, { proposalId }, { user }) => {
          await verifyRole(user,'client');
            
              const client = await pool.connect();
              
              try {
                await client.query("BEGIN");
            
                // Check if the job is already assigned
                const alreadyAccepted = await client.query(
                  // `SELECT * FROM projects WHERE "jobId" = (SELECT "jobId" FROM proposals WHERE id = $1)`,
                  // [proposalId]
                  `SELECT 1 FROM projects p
                   JOIN proposals pr 
                   ON p."jobId"=pr."jobId"
                   WHERE pr.id=$1`,[proposalId]
                );
            
                if (alreadyAccepted.rows.length > 0) {
                  await client.query("ROLLBACK");
                  throw new Error("This job is already assigned to someone else.");
                }
            
                const proposalResult = await client.query(
                  `SELECT p.*, j."clientId" 
                   FROM proposals p
                   JOIN jobs j ON p."jobId" = j.id
                   WHERE p.id = $1 and j."clientId"= $2`,
                  [proposalId,user.id]
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
            
                if (!proposal.freelancerId) {
                  await client.query("ROLLBACK");
                  throw new Error("Proposal is missing freelancer information.");
                }
            
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
            await verifyRole(user,'client');
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
}

export default clientResolvers;