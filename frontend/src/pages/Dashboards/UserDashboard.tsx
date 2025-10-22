import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logoutUser } from "../../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, Settings, LogOut, Home } from "lucide-react";

const UserDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const menuItems = [
    { label: "Home", icon: Home, path: "/user" },
    { label: "Profile", icon: User, path: "/user/profile" },
    { label: "Settings", icon: Settings, path: "/user/settings" },
  ];

  return (
    <div className="flex h-screen bg-(--bg-body) text-(--text-body)">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full bg-(--bg-card) border-r border-(--border-color) shadow-md w-56 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-(--border-color)">
          <h1 className="text-lg font-bold text-(--text-heading)">
            User Panel
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
              onClick={() => navigate(item.path)}
              className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-(--color-bazaar-100) transition"
            >
              <item.icon className="mr-3 text-(--color-accent)" size={18} />
              <span>{item.label}</span>
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
              Welcome, {user?.name || "User"}
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

        {/* ===== Content ===== */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-(--bg-card) p-8 rounded-xl shadow-md border border-(--border-color)">
            <h3 className="text-xl font-semibold text-(--text-heading) mb-4">
              Dashboard Overview
            </h3>
            <p className="text-(--color-bazaar-600)">
              This is your personal dashboard. From here, you can view your
              profile, manage settings, and access other features.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
