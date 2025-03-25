import {pool} from "../config/database.js"
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

export {fetchJobById,fetchUserById}