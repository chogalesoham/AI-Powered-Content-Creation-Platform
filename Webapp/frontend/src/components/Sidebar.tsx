import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings,
  Zap
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tone Analysis', href: '/tone-analysis', icon: BarChart3 },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Profile Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen fixed top-0 left-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">ContentAI</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.name === 'AI Chat' ? '/post-generation-ai' : item.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-sm border-l-4 border-purple-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-colors ${
                      isActive
                        ? 'bg-purple-200 text-purple-700'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">
                      {item.name === 'AI Chat' ? 'Post Generation AI' : item.name}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Online</p>
            <p className="text-xs text-gray-500">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}