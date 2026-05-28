import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    
    let tempErrors = {};
    if (!username.trim()) tempErrors.username = "Username is required";
    if (!password) tempErrors.password = "Password is required";
    
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("role", res.data.role);
      window.dispatchEvent(new Event("authChange"));
      navigate(res.data.isAdmin ? "/admin" : "/");
    } catch {
      setErrors({ form: "Login failed: Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left — decorative panel */}
      <div className="login-visual">
        <div className="login-visual-inner">
          <div className="login-visual-badge">🌿 Verdana Market</div>
          <h2 className="login-visual-title">Fresh from<br />the farm,<br /><em>daily.</em></h2>
          <p className="login-visual-sub">Premium organic produce delivered straight to your door.</p>
          <div className="login-visual-tags">
            <span>🚚 Same-day delivery</span>
            <span>🌱 100% Organic</span>
            <span>🛡️ Quality guarantee</span>
          </div>
        </div>
        <div className="login-visual-overlay" />
        <img
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&fit=crop"
          alt="Fresh produce"
          className="login-visual-bg"
        />
      </div>

      {/* Right — form */}
      <div className="login-form-side">
        <div className="login-form-wrap">
          <div className="login-form-top">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue shopping</p>
          </div>

          <form onSubmit={handleLogin} className="login-form" noValidate>
            {errors.form && (
              <div style={{ padding: "10px", backgroundColor: "#fdecea", color: "#e74c3c", borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem" }}>
                {errors.form}
              </div>
            )}
            
            <div className="lf-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors({...errors, username: ""}) }}
                placeholder="Enter your username"
                autoFocus
                style={{ borderColor: errors.username ? "#e74c3c" : undefined }}
              />
              {errors.username && <span style={{ color: "#e74c3c", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>{errors.username}</span>}
            </div>
            <div className="lf-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: ""}) }}
                placeholder="••••••••"
                style={{ borderColor: errors.password ? "#e74c3c" : undefined }}
              />
              {errors.password && <span style={{ color: "#e74c3c", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>{errors.password}</span>}
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading} style={{ marginTop: "1rem" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="login-switch">
            Don't have an account?{" "}
            <Link to="/signup">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
