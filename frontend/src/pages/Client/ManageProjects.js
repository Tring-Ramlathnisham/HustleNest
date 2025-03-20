import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../context/projectSlice";
import ProjectCard from "../../components/ProjectCard";
import styles from "../../styles/Project.module.css";

const ManageProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h2>Manage Your Projects</h2>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} role="client" />
      ))}
    </div>
  );
};

export default ManageProjects;
