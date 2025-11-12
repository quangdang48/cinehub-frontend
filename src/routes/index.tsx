import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home-page";
import LoginPage from "../pages/login-page";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginPage /> },
]);
