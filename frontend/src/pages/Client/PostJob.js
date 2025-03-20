import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import "./PostJob.css";

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

const PostJob = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { role } = useSelector((state) => state.auth); // Get user role & token from Redux

  const [postJob, { loading, error }] = useMutation(POST_JOB_MUTATION, {
  
    onCompleted: (data) => {
      if (data && data.postJob) {
        alert("Job Posted Successfully!");
      }
    },
  });

  const onSubmit = async (formData) => {
    if (role !== "client") {
      alert("Only clients can post jobs!");
      return;
    }

    try {
      await postJob({
        variables: { 
          ...formData, 
          budget: parseFloat(formData.budget) 
        }
      });
    } catch (err) {
      console.error("Error posting job:", err.message);
    }
  };

  return (
    <div className="post-job-container">
      <h2>Post a Job</h2>
      {error && <p className="error-message">{error.message}</p>} {/* 🔹 Display errors */}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Job Title */}
        <input type="text" placeholder="Job Title" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="error-message">{errors.title.message}</p>}

        {/* Job Description */}
        <textarea placeholder="Job Description" {...register("description", { required: "Description is required" })}></textarea>
        {errors.description && <p className="error-message">{errors.description.message}</p>}

        {/* Budget */}
        <input 
          type="number" step="0.01" placeholder="Budget" 
          {...register("budget", { required: "Budget is required", min: { value: 1, message: "Budget must be at least $1" }})} 
        />
        {errors.budget && <p className="error-message">{errors.budget.message}</p>}

        {/* Domain Selection */}
        <select {...register("domain", { required: "Please select a domain" })}>
          <option value="">Select Domain</option>
          <option value="Web Development">Web Development</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="App Development">App Development</option>
        </select>
        {errors.domain && <p className="error-message">{errors.domain.message}</p>}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>{loading ? "Posting..." : "Post Job"}</button>
      </form>
    </div>
  );
};

export default PostJob;
