import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {logout} from "./context/authSlice";
import Login from "./pages/Auth/Login";
import Home from "./pages/Common/Home";
import Register from "./pages/Auth/Register";
import ClientDashboard from "./pages/Client/Dashboard";
import FreelancerDashboard from "./pages/Freelancer/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import NavBar from "./components/NavBar"; 

const App = () => {

  const dispatch=useDispatch();
  const token=useSelector((state)=>state.auth.token);
  const userRole=useSelector((state)=>state.auth.role);

  const handleLogout=()=>{
    dispatch(logout());
  };

  return (
    <>
      {/* ✅ Navbar should always be present */}
      <NavBar isLoggedIn={!!token} userRole={userRole} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ✅ Private Routes for Authenticated Users */}
        <Route
          path="/client-dashboard"
          element={
            <PrivateRoute role="client" userRole={userRole} token={token}>
              <ClientDashboard/>
            </PrivateRoute>
          }
        />
        <Route
          path="/freelancer-dashboard"
          element={
            <PrivateRoute role="freelancer" userRole={userRole} token={token}>
              <FreelancerDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
