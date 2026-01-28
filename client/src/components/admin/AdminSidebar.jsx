import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md p-5">
      <h2 className="text-xl font-bold text-green-700 mb-6">Admin Panel</h2>

      <nav className="space-y-3">
        <NavLink to="/admin" end className="block p-2 rounded hover:bg-green-50">
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/service-providers" className="block p-2 rounded hover:bg-green-50">
          <Users size={18} /> Service Providers
        </NavLink>

        <NavLink to="/admin/grievances" className="block p-2 rounded hover:bg-green-50">
          <MessageSquare size={18} /> Grievances
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="mt-10 flex items-center gap-2 text-red-600 font-semibold"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
