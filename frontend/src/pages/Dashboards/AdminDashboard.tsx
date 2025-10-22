import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logoutUser } from "../../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard" },
    { label: "Manage Users" },
    { label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-(--bg-body) text-(--text-body)">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full bg-(--bg-card) border-r border-(--border-color) w-64 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-(--border-color)">
          <h1 className="text-xl font-bold text-(--text-heading)">
            Admin Panel
          </h1>
          <button
            className="md:hidden text-(--color-bazaar-600)"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center w-full px-4 py-2 text-(--text-body) hover:bg-(--color-bazaar-100) transition"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="flex flex-col flex-1">
        {/* ===== Navbar ===== */}
        <header className="flex items-center justify-between px-6 py-4 bg-(--bg-card) border-b border-(--border-color) shadow-sm">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-(--color-bazaar-600)"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-semibold text-(--text-heading)">
              Welcome, {user?.name || "Admin"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-(--color-bazaar-600)">
              Role: <strong>{user?.role}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-(--color-accent) hover:bg-(--color-accent-hover) text-white py-2 px-4 rounded-md transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* ===== Content Section ===== */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-(--bg-card) p-8 rounded-xl shadow-md border border-(--border-color)">
            <h3 className="text-xl font-semibold text-(--text-heading) mb-4">
              Dashboard Overview
            </h3>
            <p className="text-(--color-bazaar-600)">
              Here you can manage users, view reports, and update system
              settings. More admin actions can be added here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
