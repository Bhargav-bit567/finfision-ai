import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, TrendingUp, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const signupSuccess = location.state?.signupSuccess;
  const login = useAuthStore((s) => s.login);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    clearError();
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || authError);
    }
  };

  return (
    <div className="auth-page">
      {/* Ambient background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="auth-showcase">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <TrendingUp size={20} />
            </div>
            <span>Finfision</span>
          </Link>
          
          <div className="auth-abstract-art">
             <div className="art-ring" />
             <div className="art-orb">
                <TrendingUp size={32} color="rgba(255,255,255,0.8)" />
             </div>
          </div>

          <div className="showcase-content">
            <h2>Harness the psychology of markets.</h2>
            <p>Our behavioral engine tracks emotional bias and discipline to give you a genuine trading edge.</p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {signupSuccess && !error && (
              <motion.div
                className="auth-success"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}
              >
                Account created successfully! Please sign in.
              </motion.div>
            )}

            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">Create one free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
