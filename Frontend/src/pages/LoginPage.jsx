import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
  Sparkles,
  Star,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const { darkMode } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/app");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"
          : "bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            darkMode ? "bg-indigo-500/20" : "bg-indigo-500/10"
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            darkMode ? "bg-purple-500/20" : "bg-purple-500/10"
          }`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse ${
            darkMode ? "bg-pink-500/10" : "bg-pink-500/5"
          }`}
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className={`absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse ${
            darkMode ? "bg-cyan-500/10" : "bg-cyan-500/5"
          }`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute bottom-10 right-10 w-40 h-40 rounded-full blur-2xl animate-pulse ${
            darkMode ? "bg-violet-500/10" : "bg-violet-500/5"
          }`}
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Floating particles with different shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div key={i}>
            <div
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {i % 3 === 0 ? (
                <div
                  className={`w-1 h-1 rounded-full ${
                    darkMode ? "bg-white/30" : "bg-indigo-500/30"
                  }`}
                ></div>
              ) : i % 3 === 1 ? (
                <Star
                  className={`w-2 h-2 ${
                    darkMode ? "text-white/20" : "text-indigo-500/20"
                  }`}
                />
              ) : (
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    darkMode ? "bg-indigo-400/30" : "bg-purple-500/30"
                  }`}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Enhanced header with premium styling */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-all duration-300">
                <Zap className="w-9 h-9 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles
                    className="w-3 h-3 text-white animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
              </div>
              <div
                className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              ContentAI
            </h1>
          </div>
          <h2
            className={`text-5xl font-bold mb-4 tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome back
          </h2>
          <p
            className={`text-xl mb-3 ${
              darkMode ? "text-purple-200" : "text-gray-600"
            }`}
          >
            Sign in to your account
          </p>
          <div
            className={`flex items-center justify-center space-x-2 ${
              darkMode ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-lg">AI-powered content creation awaits</span>
            <Sparkles
              className="w-5 h-5 text-yellow-400 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Enhanced glass card */}
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

            {/* Enhanced email field */}
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
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                    focusedField === "email"
                      ? "text-indigo-400 scale-110"
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
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-white/70"
                  }`}
                  placeholder="Enter your email"
                />
                {focusedField === "email" && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-400/30 animate-pulse pointer-events-none"></div>
                )}
              </div>
            </div>

            {/* Enhanced password field */}
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
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                    focusedField === "password"
                      ? "text-indigo-400 scale-110"
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
                  className={`w-full pl-12 pr-12 py-4 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] ${
                    darkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-white/70"
                  }`}
                  placeholder="Enter your password"
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
                {focusedField === "password" && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-400/30 animate-pulse pointer-events-none"></div>
                )}
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button
                className={`text-sm transition-colors duration-200 underline ${
                  darkMode
                    ? "text-indigo-300 hover:text-indigo-200"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
                onClick={() => console.log("Forgot password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Enhanced submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in to your account"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>

          {/* Enhanced social login section */}
          <div className="mt-8">
            <div className="relative">
              <div
                className={`absolute inset-0 flex items-center ${
                  darkMode ? "border-white/20" : "border-gray-300"
                }`}
              >
                <div
                  className={`w-full border-t ${
                    darkMode ? "border-white/20" : "border-gray-300"
                  }`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-6 backdrop-blur-sm rounded-full ${
                    darkMode
                      ? "bg-white/10 text-purple-200"
                      : "bg-white/80 text-gray-600"
                  }`}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin("GitHub")}
                className={`flex items-center justify-center px-6 py-4 backdrop-blur-sm border rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 group ${
                  darkMode
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                    : "bg-white/50 border-gray-200 hover:bg-white/70 hover:border-gray-300"
                }`}
              >
                <Github
                  className={`w-5 h-5 transition-colors duration-200 ${
                    darkMode
                      ? "text-white group-hover:text-indigo-300"
                      : "text-gray-700 group-hover:text-indigo-600"
                  }`}
                />
                <span
                  className={`ml-3 text-sm font-semibold transition-colors duration-200 ${
                    darkMode
                      ? "text-white group-hover:text-indigo-300"
                      : "text-gray-700 group-hover:text-indigo-600"
                  }`}
                >
                  GitHub
                </span>
              </button>
              <button
                onClick={() => handleSocialLogin("Google")}
                className={`flex items-center justify-center px-6 py-4 backdrop-blur-sm border rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 group ${
                  darkMode
                    ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30"
                    : "bg-white/50 border-gray-200 hover:bg-white/70 hover:border-gray-300"
                }`}
              >
                <Chrome
                  className={`w-5 h-5 transition-colors duration-200 ${
                    darkMode
                      ? "text-white group-hover:text-indigo-300"
                      : "text-gray-700 group-hover:text-indigo-600"
                  }`}
                />
                <span
                  className={`ml-3 text-sm font-semibold transition-colors duration-200 ${
                    darkMode
                      ? "text-white group-hover:text-indigo-300"
                      : "text-gray-700 group-hover:text-indigo-600"
                  }`}
                >
                  Google
                </span>
              </button>
            </div>
          </div>

          {/* Enhanced footer */}
          <div className="mt-8 text-center space-y-3">
            <p className={darkMode ? "text-purple-200" : "text-gray-600"}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text font-semibold hover:from-indigo-300 hover:to-purple-300 transition-all duration-200 hover:scale-105 inline-block underline"
              >
                Sign up for free
              </Link>
            </p>
            <p
              className={`text-xs ${
                darkMode ? "text-purple-300/60" : "text-gray-500"
              }`}
            >
              By signing in, you agree to our{" "}
              <button
                className={`underline transition-colors duration-200 ${
                  darkMode ? "hover:text-purple-200" : "hover:text-gray-700"
                }`}
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                className={`underline transition-colors duration-200 ${
                  darkMode ? "hover:text-purple-200" : "hover:text-gray-700"
                }`}
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>

        {/* Additional footer message */}
        <div
          className={`text-center mt-6 text-sm ${
            darkMode ? "text-purple-300/50" : "text-gray-500"
          }`}
        >
          <p>
            ✨ Join thousands of creators using AI to transform their content
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
