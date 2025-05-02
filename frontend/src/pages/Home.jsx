import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import useAuth from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      return navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="homepage-container">
      <Navbar />
      <h1>Welcome to home page</h1>
    </div>
  );
};

export default Home;
