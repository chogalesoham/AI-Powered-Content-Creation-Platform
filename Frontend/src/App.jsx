import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContentGenerator from "./pages/ContentGenerator";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Placeholder components for new pages
const Scheduler = () => (
  <div className="max-w-2xl mx-auto mt-10 card p-8 text-center">
    Scheduler coming soon!
  </div>
);
const Drafts = () => (
  <div className="max-w-2xl mx-auto mt-10 card p-8 text-center">
    Drafts Library coming soon!
  </div>
);
const Templates = () => (
  <div className="max-w-2xl mx-auto mt-10 card p-8 text-center">
    Templates Library coming soon!
  </div>
);
const Profile = () => (
  <div className="max-w-2xl mx-auto mt-10 card p-8 text-center">
    Profile & Settings coming soon!
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 animate-pulse-slow"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            AI Content Platform
          </h2>
          <p className="text-gray-500 mt-2">
            Loading your creative workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route path="/app" element={<Layout />}>
                <Route path="generate" element={<ContentGenerator />} />
                <Route path="scheduler" element={<Scheduler />} />
                <Route path="drafts" element={<Drafts />} />
                <Route path="templates" element={<Templates />} />
                <Route path="profile" element={<Profile />} />
                <Route index element={<ContentGenerator />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
