import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import appConfig from "@/config/app.config";

const { unAuthenticatedEntryPath } = appConfig;

const ProtectedRoute = () => {
  const { authenticated } = useAuth();

  const location = useLocation();

  if (!authenticated) {
    return (
      <Navigate
        replace
        to={`${unAuthenticatedEntryPath}?redirectUrl=${location.pathname}`}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
