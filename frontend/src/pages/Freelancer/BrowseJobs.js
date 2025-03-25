import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import styles from "./BrowseJobs.module.css";
import GET_ALL_JOBS from "../../api/freelancer/getAllJobs";


const BrowseJobs = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_ALL_JOBS,{
    fetchPolicy:"network-only",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");

  console.log("Jobs:",data);

  if (loading) return <p>Loading jobs...</p>;
  if (error) {
    console.error("Error:",error);
    return <p>Error loading jobs</p>;}

  // Get unique domains for filter dropdown
  const uniqueDomains = [
    ...new Set(data.jobs.map((job) => job.domain)),
  ];

  // Filtered Jobs based on search and domain filter
  const filteredJobs = data.jobs.filter((job) => {
    return (
      (selectedDomain ? job.domain === selectedDomain : true) &&
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={styles.jobListPage}>
      <h3>Available Freelance Jobs</h3>

      {/* Search & Filter Section */}
      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />

        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className={styles.filterDropdown}
        >
          <option value="">All Domains</option>
          {uniqueDomains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>

      {/* Job Grid */}
      <div className={styles.jobGrid}>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={styles.jobCard}
          >
            <h4>{job.title}</h4>
            <p>{job.description}</p>
            <p>
              <strong>Client: </strong> {job.client.name}
            </p>
            <p>
              <strong>Domain: </strong> {job.domain}
            </p>
            <p>
              <strong>Budget:</strong> ${job.budget}
            </p>
            <button className={styles.applyButton} onClick={()=>navigate(`/freelancer/applyJob/${job.id}`)}>Apply</button>
          </div>
        ))}
      </div>

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default BrowseJobs;
