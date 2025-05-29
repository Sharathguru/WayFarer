import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import { CssBaseline } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Itinerary from "./pages/Itinerary";
import Success from './pages/Success';

function App() {
  const theme = useTheme();
  return (
    <>
      <CssBaseline />
      <div style={{ backgroundColor: theme.palette.background.default }}>
        <Routes>
          <Route path="/" element={<Welcome />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/itenaries/:id" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
          <Route 
            path="/success" 
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

    </>
  );
}

export default App;