import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import styles from "./PostJob.module.css";
import { useNavigate } from "react-router-dom";

// 🔹 GraphQL Mutation for Posting a Job
const POST_JOB_MUTATION = gql`
  mutation PostJob($title: String!, $description: String!, $budget: Float!, $domain: String!) {
    postJob(title: $title, description: $description, budget: $budget, domain: $domain) {
      id
      title
      description
      budget
      domain
    }
  }
`;
const GET_CLIENT_STATS = gql`
  query GetClientDashboardStats($clientId: ID!) {
    getClientDashboardStats(clientId: $clientId) {
      totalJobs
      totalProposals
      activeProjects
      jobs {
        id
        title
        proposalCount
      }
    }
  }
`;

const PostJob = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useSelector((state) => state.auth);
  console.log('user:',user);
  const clientId=user?.id|| null;
  console.log("Client Id:",clientId);
  const navigate =useNavigate();

  const [postJob, { loading, error }] = useMutation(POST_JOB_MUTATION,{
    refetchQueries:[{query:GET_CLIENT_STATS,variables:{clientId:clientId.toString()}}]
  });


  const onSubmit = async (formData) => {
    // if (role !== "client") {
    //   alert("Only clients can post jobs!");
    //   return;
    // }
    try {
      await postJob({
        variables: { 
          ...formData, 
          budget: parseFloat(formData.budget) 
        }
      });
      alert("Job Posted Successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error posting job:", err.message);
    }
  };

  return (
    <div className={styles.postJobPage}>
    <div className={styles.postJobContainer}>
      <h2>Post a Job</h2>
      {error && <p className={styles.errorMessage}>{error.message}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Job Title */}
        <input type="text" placeholder="Job Title" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className={styles.errorMessage}>{errors.title.message}</p>}

        {/* Job Description */}
        <textarea placeholder="Job Description" {...register("description", { required: "Description is required" })}></textarea>
        {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}

        {/* Budget */}
        <input 
          type="number" step="0.01" placeholder="Budget ($) " 
          {...register("budget", { required: "Budget is required", min: { value: 1, message: "Budget must be at least $1" }})} 
        />
        {errors.budget && <p className={styles.errorMessage}>{errors.budget.message}</p>}

        {/* Domain Selection */}
        <select {...register("domain", { required: "Please select a domain" })}>
          <option value="">Select Domain</option>
          <option value="Web Development">Web Development</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="App Development">App Development</option>
        </select>
        {errors.domain && <p className={styles.errorMessage}>{errors.domain.message}</p>}

        <button type="submit" className={styles.postButton} disabled={loading}>{loading ? "Posting..." : "Post Job"}</button>
      </form>
    </div>
    </div>
  );
};

export default PostJob;
