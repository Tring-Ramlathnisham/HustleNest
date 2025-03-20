import React from "react";
import { useDispatch } from "react-redux";
import { updateProjectStatus } from "../context/projectSlice";
import styles from "../styles/Project.module.css";

const ProjectCard = ({ project, role }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (newStatus) => {
    dispatch(updateProjectStatus({ projectId: project.id, status: newStatus }));
  };

  return (
    <div className={styles.projectCard}>
      <h3>{project.title}</h3>
      <p>Status: {project.status}</p>
      <p>Client: {project.client.name}</p>
      <p>Freelancer: {project.freelancer?.name || "Not assigned"}</p>

      {role === "freelancer" && (
        <button onClick={() => handleStatusChange("In Progress")}>Start Work</button>
      )}
      {role === "client" && (
        <button onClick={() => handleStatusChange("Completed")}>Mark as Completed</button>
      )}
    </div>
  );
};

export default ProjectCard;
