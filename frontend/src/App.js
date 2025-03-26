import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {logout} from "./context/authSlice";
import Login from "./pages/auth/Login";
import Home from "./pages/common/Home";
import Register from "./pages/auth/Register";
import ClientDashboard from "./pages/client/Dashboard";
import FreelancerDashboard from "./pages/freelancer/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import NavBar from "./components/NavBar"; 
import PostJob from "./pages/client/PostJob";
import ManageProposals from "./pages/client/ManageProposals";
import ProposalDetails from "./pages/client/ProposalDetails";
import JobList from "./pages/client/JobList";
import BrowseJobs from "./pages/freelancer/BrowseJobs";
import ApplyJob from "./pages/freelancer/ApplyJob";
import Applications from "./pages/freelancer/Applications";
import Projects from "./pages/freelancer/Projects";

const App = () => {

  const dispatch=useDispatch();
  const token=useSelector((state)=>state.auth.token);
  const userRole=useSelector((state)=>state.auth.role);

  const handleLogout=()=>{
    dispatch(logout());
  };

  return (
    <>
      {/*  Navbar */}
      <NavBar isLoggedIn={!!token} userRole={userRole} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/*  Private Routes for Authenticated Users */}
        <Route
          path="/client/dashboard"
          element={
            <PrivateRoute role="client" userRole={userRole} token={token}>
              <ClientDashboard/>
            </PrivateRoute>
          }
        />
        <Route
          path="/freelancer/dashboard"
          element={
            <PrivateRoute role="freelancer" userRole={userRole} token={token}>
              <FreelancerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/client/postJob"
          element={
            <PrivateRoute role="client" userRole={userRole} token={token}>
              <PostJob />
            </PrivateRoute>
          }
        />

        <Route
          path="/client/manageProposals/:jobId"
          element={
            <PrivateRoute role="client" userRole={userRole} token={token}>
              <ManageProposals />
            </PrivateRoute>
          }
        />

      <Route
          path="/client/jobs"
          element={
            <PrivateRoute role="client" userRole={userRole} token={token}>
              <JobList />
            </PrivateRoute>
          }
      />

          
        <Route
          path="/client/proposalDetails/:proposalId"
          element={
            <PrivateRoute role="client" userRole={userRole} token={token}>
              <ProposalDetails />
            </PrivateRoute>
          }
        />

      {/* Freelancer routes*/}

        <Route
          path="/freelancer/jobs"
          element={
            <PrivateRoute role="freelancer" userRole={userRole} token={token}>
              <BrowseJobs />
            </PrivateRoute>
          }
         />

         {/* Apply a job*/}

        <Route
          path="/freelancer/applyJob/:jobId"
          element={
            <PrivateRoute role="freelancer" userRole={userRole} token={token}>
              <ApplyJob />
            </PrivateRoute>
          }
         />

         {/* Applications of a freelancer*/}

        <Route
          path="/freelancer/applications"
          element={
            <PrivateRoute role="freelancer" userRole={userRole} token={token}>
              <Applications/>
            </PrivateRoute>
          }
         />

         {/* Projects of a freelancer*/}

         <Route
          path="/freelancer/myProjects"
          element={
            <PrivateRoute role="freelancer" userRole={userRole} token={token}>
              <Projects/>
            </PrivateRoute>
          }
         />
      </Routes>
    </>
  );
};

export default App;
