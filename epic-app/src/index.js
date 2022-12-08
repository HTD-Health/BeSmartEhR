import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LaunchPage } from "./pages/launch";
import { StandalonePage } from "./pages/standalone";

// Epic will not match different redirectUris
// so we need one endpoint for both modes
const router = createBrowserRouter([
  {
    path: "/",
    element: <StandalonePage />,
    // element: <LaunchPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
