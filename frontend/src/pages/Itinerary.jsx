import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
} from "@mui/material";

import Navbar from "../components/Navbar";
import { format } from "date-fns";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const fallbackImage = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

const Itinerary = () => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchItinerary = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/itenaries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Itinerary Data:", res.data);
      setItinerary(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch itinerary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary(id);
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h4" gutterBottom>
            {itinerary.location}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <FlightTakeoffIcon sx={{ mr: 1 }} /> Travel Type: {itinerary.travelType}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <DateRangeIcon sx={{ mr: 1 }} />
                Dates:{" "}
                {format(new Date(itinerary.startDate), "MMM dd, yyyy")} -{" "}
                {format(new Date(itinerary.endDate), "MMM dd, yyyy")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <CurrencyRupeeIcon sx={{ mr: 1 }} /> Budget: ₹{itinerary.budget}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Daily Plans
          </Typography>

          <List>
            {itinerary.itinerary.days.map((day, index) => (
              
              <ListItem
                key={index}
                sx={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                {console.log("Day Data:", day)}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Date: {day.date}
                </Typography>
                <Grid container spacing={2}>
                  {day.planDetails?.map((plan, i) => (
                    <Grid item key={i}>
                      {console.log("Plan Data:", plan)}
                      <img
                        src={plan.photoUrl || fallbackImage}
                        alt={plan.placeName}
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                        style={{ width: "150px", height: "100px", borderRadius: 8 }}
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        align="center"
                        mt={1}
                      >
                        {typeof plan.placeName === "object"
                          ? `${plan.placeName.location || ""} ${plan.placeName.activity || ""}`
                          : plan.placeName}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Tips
          </Typography>
          <List>
            {itinerary.itinerary.tips?.slice(0, 3).map((tip, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <TipsAndUpdatesIcon />
                </ListItemIcon>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </>
  );
};

export default Itinerary;
