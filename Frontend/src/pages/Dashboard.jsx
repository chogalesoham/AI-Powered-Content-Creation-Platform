import { Link } from "react-router-dom";
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Calendar,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const metrics = [
    { title: "Total Posts", value: "1,247", change: "+12%", icon: TrendingUp },
    { title: "Total Reach", value: "2.4M", change: "+8%", icon: Eye },
    { title: "Engagement Rate", value: "4.2%", change: "+2.1%", icon: Heart },
    { title: "Comments", value: "8,934", change: "+15%", icon: MessageCircle },
  ];

  const quickActions = [
    {
      title: "Create New Post",
      description: "Generate AI-powered content",
      icon: Plus,
      href: "/app/generate",
    },
    {
      title: "Schedule Content",
      description: "Plan your content calendar",
      icon: Calendar,
      href: "/app/calendar",
    },
    {
      title: "View Analytics",
      description: "Check your performance",
      icon: BarChart3,
      href: "/app/analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your content.
          </p>
        </div>
        <Link to="/app/generate" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
                <p className="text-sm font-medium text-green-600">
                  {metric.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-indigo-600">
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="card hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center justify-center mb-4">
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
