import React from "react";
import { useSelector } from "react-redux";

const FreelancerDashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h1>Freelancer Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
};

export default FreelancerDashboard;
