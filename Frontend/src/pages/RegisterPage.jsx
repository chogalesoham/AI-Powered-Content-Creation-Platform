import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Eye, EyeOff, Mail, User, Lock, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registration successful:", formData);
      // In real app: await register(formData.name, formData.email, formData.password);
      // navigate('/app');
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            darkMode ? "bg-purple-500/20" : "bg-purple-500/10"
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            darkMode ? "bg-indigo-500/20" : "bg-indigo-500/10"
          }`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse ${
            darkMode ? "bg-pink-500/10" : "bg-pink-500/5"
          }`}
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-pulse ${
              darkMode ? "bg-white/20" : "bg-indigo-500/20"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-all duration-300">
                <Zap className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles
                  className="w-4 h-4 text-yellow-400 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              ContentAI
            </h1>
          </div>
          <h2
            className={`text-4xl font-bold mb-3 tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Create your account
          </h2>
          <p
            className={`text-lg ${
              darkMode ? "text-purple-200" : "text-gray-600"
            }`}
          >
            Start creating amazing content today
          </p>
        </div>

        {/* Form Card */}
        <div
          className={`backdrop-blur-xl rounded-3xl border shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
            darkMode
              ? "bg-white/10 border-white/20 shadow-black/50"
              : "bg-white/80 border-gray-200/50 shadow-gray-500/20"
          }`}
        >
          <div className="space-y-6">
            {error && (
              <div
                className={`p-4 border rounded-2xl text-sm backdrop-blur-sm animate-bounce ${
                  darkMode
                    ? "bg-red-500/20 border-red-400/30 text-red-200"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      darkMode ? "bg-red-400" : "bg-red-500"
                    }`}
                  ></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-purple-200" : "text-gray-700"
                }`}
              >
                Full name
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === "name"
                      ? "text-indigo-400"
                      : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  required
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 backdrop-blur-sm transform transition-all duration-200 hover:scale-[1.02] ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-white/70"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-purple-200" : "text-gray-700"
                }`}
              >
                Email address
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === "email"
                      ? "text-indigo-400"
                      : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  required
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 backdrop-blur-sm transform transition-all duration-200 hover:scale-[1.02] ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-white/70"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-purple-200" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-indigo-400"
                      : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 backdrop-blur-sm transform transition-all duration-200 hover:scale-[1.02] ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-white/70"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-400 hover:text-indigo-400"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-purple-200" : "text-gray-700"
                }`}
              >
                Confirm password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === "confirmPassword"
                      ? "text-indigo-400"
                      : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  required
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 backdrop-blur-sm transform transition-all duration-200 hover:scale-[1.02] ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-white/70"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-400 hover:text-indigo-400"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </span>
            </button>
          </div>

          {/* Sign in link */}
          <div className="mt-8 text-center">
            <p className={darkMode ? "text-purple-200" : "text-gray-600"}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text font-semibold hover:from-indigo-300 hover:to-purple-300 transition-all duration-200 hover:scale-105 inline-block underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`text-center mt-8 text-sm ${
            darkMode ? "text-purple-300/60" : "text-gray-500"
          }`}
        >
          <p>By creating an account, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
