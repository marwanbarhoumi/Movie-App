import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed, loadingAuth } = useAuth();
  const location = useLocation();

  // while checking token
  if (loadingAuth) return <div className="muted">Loading...</div>;

  // not logged in -> redirect to login and remember where user was going
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}