import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get("accessToken");
  console.log(token);

  return token ? children : <Navigate to="/login" replace />;
};

export const ReverseProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const token = Cookies.get("accessToken");

  // If the user is authenticated, redirect them to the dashboard
  if (token) {
    return <Navigate to="/admin" replace />;
  }

  // If the user is not authenticated, allow them to access the login page
  return children;
};
