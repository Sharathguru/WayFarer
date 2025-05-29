import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import Navbar from "../components/Navbar";

const MyTrip = () => {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/itenaries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(res.data);
      } catch (err) {
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTrips();
  }, [token]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h2>My Trips</h2>
        {loading ? (
          <div>Loading...</div>
        ) : trips.length === 0 ? (
          <div>No trips found.</div>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {trips.map((trip) => (
              <li
                key={trip._id}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  background: "#fafafa",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <h3 style={{ margin: 0 }}>{trip.travelType || "Trip"}</h3>
                <div>
                  <strong>Location:</strong> {trip.location}
                </div>
                <div>
                  <strong>Dates:</strong> {trip.startDate} - {trip.endDate}
                </div>
                <div>
                  <strong>Budget:</strong> ${trip.budget}
                </div>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyTrip;