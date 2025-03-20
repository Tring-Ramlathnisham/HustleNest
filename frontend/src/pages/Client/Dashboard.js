import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, gql } from "@apollo/client";
import {Chart as ChartJS,ArcElement,Tooltip,Legend} from "chart.js";
import { Pie } from "react-chartjs-2";
import "../../styles/ClientDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const GET_CLIENT_STATS = gql`
  query GetClientDashboardStats($clientId: ID!) {
    getClientDashboardStats(clientId: $clientId) {
      totalJobs
      totalProposals
      activeProjects
    }
   
    
  }
`;

/** getRecentProposals(clientId: $clientId) {
      id
      freelancer{
        name      
      }
      job{
        title
      }
      status
    } */
const ClientDashboard = () => {

  const user =useSelector((state)=>state.auth?.user);
  console.log("user:",user);

  const clientId=user?.id || null;
  console.log("redux id:",clientId);

 
  const { data, loading, error } = useQuery(GET_CLIENT_STATS, {
    variables: clientId ? {clientId: clientId.toString()} : null, 
  });

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      setChartData({
        labels: ["Total Jobs", "Proposals Received", "Active Projects"],
        datasets: [
          {
            data: [
              data.getClientDashboardStats.totalJobs,
              data.getClientDashboardStats.totalProposals,
              data.getClientDashboardStats.activeProjects,
            ],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) {console.error("Error:",error);
  return <p>Error loading dashboard</p>;}

  return (
    <div className="dashboard-container">
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>{data.getClientDashboardStats.totalJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Proposals Received</h3>
          <p>{data.getClientDashboardStats.totalProposals}</p>
        </div>
        <div className="stat-card">
          <h3>Active Projects</h3>
          <p>{data.getClientDashboardStats.activeProjects}</p>
        </div>
      </div>

      <div className="chart-container">
        {chartData && <Pie data={chartData} />}
      </div>

      {/* <div className="recent-proposals">
        <h3>Recent Proposals</h3>
        <ul>
          {data.getRecentProposals.map((proposal) => (
            <li key={proposal.id}>
              <p><strong>{proposal.freelancerName}</strong> applied for <i>{proposal.jobTitle}</i></p>
              <span>${proposal.budget} - {proposal.status}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default ClientDashboard;
