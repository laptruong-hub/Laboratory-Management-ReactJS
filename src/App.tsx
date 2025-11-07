import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Layouts
import MainLayout from "./components/layout/MainLayout.tsx";
import AuthLayout from "./components/layout/AuthLayout.tsx";
import UserLayout from "./components/layout/UserLayout.tsx";
import WorkingLayout from "./components/layout/WorkingLayout.tsx";

// Pages - Home
import Home from "./pages/home/Homepage.tsx";

// Pages - Authentication
import Login from "./pages/authentication/Login.tsx";
import Signup from "./pages/authentication/Signup.tsx";
import ForgotPassword from "./pages/authentication/ForgotPassword.tsx";

// Pages - Admin
import AdminDashboardPage from "./pages/dashboard/AdminDashboard.tsx";


import AccountManage from "./pages/admin/AccountManage.tsx";
import RolesPage from "./pages/role/RolesPage.tsx";

// Components - User
import UserProfile from "./components/user/UserProfile.tsx";
import Index from "./components/user/index.tsx";

// Pages - Error
import NotFound from "./pages/error/NotFound.tsx";
import Forbidden from "./pages/error/Forbidden.tsx";

// Styles
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "profile",
        element: <UserProfile />,
      },
      
    ],
  },
  {
    path: "/admin",
    element: <WorkingLayout />,
    children: [
      {
        path: "admin-dashboard",
        element: <AdminDashboardPage />,
      },
      
      {
        path: "roles",
        element: <RolesPage />,
      },
      {
        path: "account",
        element: <AccountManage />,
      },
    ],
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
//comment
