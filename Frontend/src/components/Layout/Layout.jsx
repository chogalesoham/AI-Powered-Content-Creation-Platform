import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 animate-spin"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex">
      <Sidebar />

      {/* Main content */}

      {/* <Header /> */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
