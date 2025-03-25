import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ApplyJob.module.css";
import { useSelector } from "react-redux";
import APPLY_JOB from "../../api/freelancer/applyJob";
import GET_FREELANCER_STATS from "../../api/freelancer/getFreelancerStats";

const ApplyJob = () => {
  const { jobId } = useParams(); 
  const navigate = useNavigate();
  const user=useSelector((state) => state.auth?.user);
  const freelancerId = user?.id || null;
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [applyJob, { loading, error }] = useMutation(APPLY_JOB,{
    refetchQueries:[{query:GET_FREELANCER_STATS,variables:{freelancerId:freelancerId.toString()}}]
  });

  const onSubmit = async (data) => {
    try {
      await applyJob({
        variables: {
          jobId,
          coverLetter: data.coverLetter,
          proposedBudget: parseFloat(data.proposedBudget),
        },
      });
      alert("Application Submitted Successfully!");
      navigate(-1); 
    } catch (err) {
      console.error("Application Error:", err);
    }
  };
  return (
    <div className={styles.applyJobPage}>
      <h3>Apply for Job</h3>
      <form className={styles.applyForm} onSubmit={handleSubmit(onSubmit)}>
        {/* Cover Letter */}
        <label>Cover Letter</label>
        <textarea
          {...register("coverLetter", { required: "Cover Letter is required" })}
          className={styles.inputField}
          rows="4"
        />
        {errors.coverLetter && <p className={styles.error}>{errors.coverLetter.message}</p>}

        {/* Proposed Budget */}
        <label>Proposed Budget ($)</label>
        <input
          type="number"
          {...register("proposedBudget", {
            required: "Proposed budget is required",
            min: { value: 1, message: "Budget must be at least $1" },
          })}
          className={styles.inputField}
        />
        {errors.proposedBudget && <p className={styles.error}>{errors.proposedBudget.message}</p>}

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Submitting..." : "Apply"}
        </button>

        {/* Error Handling */}
        {error && <p className={styles.error}>Error submitting application.</p>}

        {/* Back Button */}
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
          Back
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;
