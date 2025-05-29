import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SnackbarProvider } from "notistack";
import "./index.css";
import App from "./App.jsx";
// import { ItineraryProvider } from "./context/ItineraryContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
          {/* <ItineraryProvider> */}
          {/* </ItineraryProvider> */}
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  // </StrictMode>
);
