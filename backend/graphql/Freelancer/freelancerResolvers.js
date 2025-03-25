import {pool} from "../../config/database.js";
import { fetchJobById,fetchUserById } from "../../helper/fetchHelper.js";
import verifyRole from "../../middleware/verifyRole.js";

const freelancerResolvers={
    Query:{
        jobs: async (_,__,{user}) => {
          await verifyRole(user,'freelancer');
          
            const result = await pool.query("SELECT * FROM jobs where status='open'");
            return result.rows;
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
        getAppliedJobs: async (_, { freelancerId },{user}) => {
           await verifyRole(user,'freelancer');
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
          getAcceptedProjects: async (_, { freelancerId },{user}) => {
            await verifyRole(user,'freelancer');
            try {
              //console.log("Fetching accepted projects for freelancerId:", freelancerId);
          
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
          
             // console.log("DB Result:", acceptedProjects.rows);
          
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
    Mutation:{
        applyJob: async (_, { jobId, coverLetter, proposedBudget }, { user }) => {
            await verifyRole(user,'freelancer');
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
    },
   Job:{
        proposalCount:async(parent)=>{
            const result=await pool.query(`Select Count(*) from proposals where "jobId"=$1`,[parent.id]);
            return parseInt(result.rows[0].count,10);
        },
        client:(parent)=>fetchUserById(parent.clientId),
    },
    Proposal:{
        job:(parent)=>fetchJobById(parent.jobId),
        freelancer:(parent)=>fetchUserById(parent.freelancerId),
     },

}

export default freelancerResolvers;