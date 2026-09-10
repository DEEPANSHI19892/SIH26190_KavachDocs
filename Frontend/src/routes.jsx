import { Navigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Dashboard from "./pages/Dashboard";
import CasesPage from "./pages/CasesPage";
import DocumentsPage from "./pages/DocumentsPage";
import AuditPage from "./pages/AuditPage";
import SecurityPage from "./pages/SecurityPage";

import CaseCreate from "./components/cases/CaseCreate";
import CaseDetail from "./components/cases/CaseDetail";

import PrivateRoute from "./components/common/PrivateRoute";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute
        allowedRoles={[
          "ADMIN",
          "INVESTIGATION_OFFICER",
          "LEGAL_OFFICER",
          "VIEWER",
        ]}
      >
        <Dashboard />
      </PrivateRoute>
    ),
  },

  {
    path: "/cases",
    element: (
      <PrivateRoute
        allowedRoles={[
          "ADMIN",
          "INVESTIGATION_OFFICER",
          "LEGAL_OFFICER",
          "VIEWER",
        ]}
      >
        <CasesPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/cases/new",
    element: (
      <PrivateRoute
        allowedRoles={[
          "ADMIN",
          "INVESTIGATION_OFFICER",
        ]}
      >
        <CaseCreate />
      </PrivateRoute>
    ),
  },

  {
    path: "/cases/:id",
    element: (
      <PrivateRoute>
        <CaseDetail />
      </PrivateRoute>
    ),
  },

  {
    path: "/documents",
    element: (
      <PrivateRoute>
        <DocumentsPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/audit",
    element: (
      <PrivateRoute allowedRoles={["ADMIN"]}>
        <AuditPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/security",
    element: (
      <PrivateRoute allowedRoles={["ADMIN"]}>
        <SecurityPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;