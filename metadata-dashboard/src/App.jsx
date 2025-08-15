// src/App.jsx
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import DashboardPage from "./pages/DashboardPage";

// Initialize Apollo Client
//framing an comment
const client = new ApolloClient({
  uri: "https://metadata-dashboard-project-2.onrender.com/",
  cache: new InMemoryCache(),
});

// A professional, dark theme for our SaaS tool
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7e57c2",
    },
    background: {
      default: "#121212", // Very dark grey, almost black
      paper: "#1e1e1e", // The color for our "cards" or containers
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline is crucial! It applies the background color and resets styles. */}
        <CssBaseline />
        <DashboardPage />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
