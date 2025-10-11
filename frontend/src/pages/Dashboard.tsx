import React from "react";
import LogoutButton from "../components/LogoutButton";

const Dashboard: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
