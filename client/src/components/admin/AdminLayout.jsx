import { Outlet, useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          {!isDashboard && (
            <div className="mb-6">
              <Link
                to="/admin"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
              </Link>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
