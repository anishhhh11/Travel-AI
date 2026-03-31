import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./components/custom/Header.jsx";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Viewtrip from "./view-trip/tripId/index.jsx";
import MyTrip from "./my-trip/index.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";

// Layout component that includes Header
const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "create-trip",
        element: <CreateTrip />,
      },
      {
        path: "view-trip/:tripId",
        element: <Viewtrip />,
      },
      {
        path: "my-trip",
        element: <MyTrip />,
      },
    ],
  },
]);

const RootApp = () => {
  const { theme } = useTheme();

  return (
    <>
      <Toaster theme={theme === "dark" ? "dark" : "light"} />
      <RouterProvider router={router} />
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <ThemeProvider>
        <RootApp />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);