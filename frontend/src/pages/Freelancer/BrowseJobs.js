import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../context/jobSlice";
import JobCard from "../../components/JobCard";
import styles from "../../styles/Dashboard.module.css";

const BrowseJobs = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h2>Available Jobs</h2>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default BrowseJobs;
