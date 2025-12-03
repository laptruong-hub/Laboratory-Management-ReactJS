import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./components/common/PrivateRoute.tsx";
import RoleBasedRoute from "./components/common/RoleBasedRoute.tsx";
import RoleRedirect from "./components/common/RoleRedirect.tsx";
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
import PatientManage from "./pages/admin/PatientManage.tsx";
import RolesPage from "./pages/role/RolesPage.tsx";
import TestOrder from "./pages/admin/TestOrder.tsx";
import WorkSlotManage from "./pages/admin/WorkSlotManage.tsx";
import PatientRequestManage from "./pages/admin/PatientRequestManage.tsx";

// Pages - Receptionist
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard.tsx";
import PatientRequestList from "./pages/receptionist/PatientRequestList.tsx";
import ReceptionistScheduleAppointment from "./pages/receptionist/ReceptionistScheduleAppointment.tsx";
import ReceptionistPatientList from "./pages/receptionist/ReceptionistPatientList.tsx";

// Pages - Lab User
import LabUserDashboard from "./pages/lab-user/LabUserDashboard.tsx";
import LabUserWorkSchedule from "./pages/lab-user/LabUserWorkSchedule.tsx";

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
        element: (
          <>
            <RoleRedirect />
            <Home />
          </>
        ),
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
        element: <RoleBasedRoute allowedRoles={["Admin", "Administrator"]} />,
        children: [
          {
            element: <WorkingLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/admin-dashboard" replace />,
              },
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
                path: "patients",
                element: <PatientManage />,
              },
              {
                path: "test-order",
                element: <TestOrder />,
              },
              {
                path: "work-slots",
                element: <WorkSlotManage />,
              },
              {
                path: "patient-requests",
                element: <PatientRequestManage />,
              },
            ],
          },
        ],
      },
      {
        path: "/receptionist",
        element: <RoleBasedRoute allowedRoles={["Receptionist", "RECEPTIONIST", "Admin", "Administrator"]} />,
        children: [
          {
            element: <WorkingLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/receptionist/dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <ReceptionistDashboard />,
              },
              {
                path: "patient-requests",
                element: <PatientRequestList />,
              },
              {
                path: "schedule-appointment",
                element: <ReceptionistScheduleAppointment />,
              },
              {
                path: "patients",
                element: <ReceptionistPatientList />,
              },
            ],
          },
        ],
      },
      {
        path: "/lab-user",
        element: (
          <RoleBasedRoute
            allowedRoles={["Lab User", "LAB USER", "Technician", "TECHNICIAN", "Admin", "Administrator"]}
          />
        ),
        children: [
          {
            element: <WorkingLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/lab-user/dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <LabUserDashboard />,
              },
              {
                path: "work-schedule",
                element: <LabUserWorkSchedule />,
              },
            ],
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
