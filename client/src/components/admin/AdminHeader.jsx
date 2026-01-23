import { useAuth } from "../../context/AuthContext";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white px-6 py-4 shadow-sm flex justify-between">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <span className="text-sm font-medium text-gray-600">
        {user?.firstName} (Admin)
      </span>
    </header>
  );
};

export default AdminHeader;
