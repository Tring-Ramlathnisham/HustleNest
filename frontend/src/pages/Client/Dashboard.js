import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, gql } from "@apollo/client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

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

const ClientDashboard = () => {
  const user = useSelector((state) => state.auth?.user);
  const clientId = user?.id || null;
  // const userName = user?.name;
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_CLIENT_STATS, {
    variables: clientId ? { clientId: clientId.toString() } : null,
    fetchPolicy:"network-only",
  });

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      const {totalJobs,totalProposals,activeProjects}=data.getClientDashboardStats;
      const isDataAvailable=totalJobs>0 || totalProposals> 0 || activeProjects > 0;
      if(isDataAvailable){
      setChartData({
        labels: ["Total Jobs", "Proposals Received", "Active Projects"],
        datasets: [
          {
            data: [totalJobs,totalProposals,activeProjects],
            backgroundColor: ["#00d4ff", "#086af4", "rgb(78, 138, 169)"],
          },
        ],
      });
    }
    else{
      setChartData(null);
    }
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  return (
    <div className={styles.dashboardPage}>
      {/* Greeting Message */}
      {/* <h2 className={styles.greeting}>Hello, {userName} </h2> */}

      {/* Main Container */}
      <div className={styles.dashboardContainer}>
        {/* Dashboard Content */}
        <div className={styles.statsSection}>
          {/* Stats Cards */}
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <h3>Total Jobs</h3>
              <p>{data.getClientDashboardStats.totalJobs}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Proposals Received</h3>
              <p>{data.getClientDashboardStats.totalProposals}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Active Projects</h3>
              <p>{data.getClientDashboardStats.activeProjects}</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className={styles.chartContainer}>
            {chartData&& <Pie data={chartData} />}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className={styles.quickActions}>
          <button onClick={() => navigate("/client/postJob")} className={styles.actionBtn}>Post a Job</button>
          <button onClick={() => navigate("/client/jobs")} className={styles.actionBtn}>View All Jobs</button>
          <button onClick={() => navigate("/client/jobs")} className={styles.actionBtn}>Manage Proposals</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
