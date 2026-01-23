const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">Total Users</div>
        <div className="bg-white p-6 rounded-xl shadow">Pending Requests</div>
        <div className="bg-white p-6 rounded-xl shadow">Open Grievances</div>
      </div>
    </div>
  );
};

export default Dashboard;
