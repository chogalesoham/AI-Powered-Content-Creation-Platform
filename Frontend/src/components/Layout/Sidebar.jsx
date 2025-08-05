import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Sparkles,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Content Generator", href: "/app/generate", icon: Sparkles },
    { name: "Scheduler", href: "/app/scheduler", icon: Calendar },
    { name: "Drafts", href: "/app/drafts", icon: FileText },
    { name: "Templates", href: "/app/templates", icon: BarChart3 },
    { name: "Profile", href: "/app/profile", icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            ContentAI
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-all duration-200 shadow-sm group border border-transparent
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-900 dark:text-indigo-100 border-indigo-300 dark:border-indigo-700"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700"
              }`
            }
          >
            <item.icon className="w-5 h-5 opacity-80 group-hover:scale-110 transition-transform" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 gap-3"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
