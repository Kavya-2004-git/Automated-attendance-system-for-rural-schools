import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../auth/Login";
import RequireAuth from "../auth/RequireAuth";

import AdminDashboard from "../dashboards/AdminDashboard";
import TeacherDashboard from "../dashboards/TeacherDashboard";
import StudentDashboard from "../dashboards/StudentDashboard";
import StudentLogin from "../modules/student/StudentLogin";
import Home from "../pages/Home";

import { getToken, getRole } from "../utils/storage";

export default function Router() {

  const token = getToken();
  const role = getRole();

  return (

    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          token ? <Navigate to={`/${role?.toLowerCase()}`} replace /> : <Login />
        }
      />

      <Route
        path="/student-login"
        element={
          token ? <Navigate to="/student" replace /> : <StudentLogin />
        }
      />


      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <AdminDashboard />
          </RequireAuth>
        }
      />


      {/* ================= TEACHER ================= */}

      <Route
        path="/teacher"
        element={
          <RequireAuth role="TEACHER">
            <TeacherDashboard />
          </RequireAuth>
        }
      />


      {/* ================= STUDENT ================= */}

      <Route
        path="/student"
        element={
          <RequireAuth role="STUDENT">
            <StudentDashboard />
          </RequireAuth>
        }
      />


      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>

  );
}
