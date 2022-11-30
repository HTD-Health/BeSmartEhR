import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {StandalonePage} from "./pages/standalone";
import {LaunchPage} from "./pages/launch";

const router = createBrowserRouter([
    {
        path: "/standalone",
        element: <StandalonePage/>,
    },
    {
        path: '/',
        element: <LaunchPage/>
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

