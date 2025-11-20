import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./components/common/PrivateRoute.tsx";
import ErrorBoundary from "./components/common/ErrorBoundary.tsx";

// Layouts
import MainLayout from "./components/layout/MainLayout.tsx";
import AuthLayout from "./components/layout/AuthLayout.tsx";
import UserLayout from "./components/layout/UserLayout.tsx";
import WorkingLayout from "./components/layout/WorkingLayout.tsx";

// Pages - Home
import Home from "./pages/home/Homepage.tsx";
import BookingPage from "./pages/booking/BookingPage.tsx";

// Pages - Authentication
import Login from "./pages/authentication/Login.tsx";
import Signup from "./pages/authentication/Signup.tsx";
import ForgotPassword from "./pages/authentication/ForgotPassword.tsx";

// Pages - Admin
import AdminDashboardPage from "./pages/dashboard/AdminDashboard.tsx";
import AccountManage from "./pages/admin/AccountManage.tsx";
import RolesPage from "./pages/role/RolesPage.tsx";
import TestOrder from "./pages/admin/TestOrder.tsx";

// Components - User
import UserProfile from "./components/user/UserProfile.tsx";
import MedicalRecord from "./components/user/MedicalRecord.tsx";

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
        index: true,
        element: <Home />,
      },
      {
        path: "booking",
        element: <BookingPage />,
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
    element: <PrivateRoute />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            path: "profile",
            element: <UserProfile />,
          },
          {
            path: "medical",
            element: <MedicalRecord />,
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
          {
            path: "test-order",
            element: <TestOrder />,
          },
        ],
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
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ErrorBoundary>
  );
}

export default App;
