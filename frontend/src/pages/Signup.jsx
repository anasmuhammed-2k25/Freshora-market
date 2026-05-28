import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    
    let tempErrors = {};
    if (!username.trim()) tempErrors.username = "Username is required";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    if (password !== confirm) tempErrors.confirm = "Passwords do not match";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("role", res.data.role);
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch {
      setErrors({ form: "Signup failed: Username might be taken" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* ── LEFT VISUAL SIDE (Perks list & Background) ── */}
      <div className="signup-visual">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&h=1200&fit=crop"
          alt="Fresh organic fruits and vegetables"
          className="signup-visual-bg"
        />
        <div className="signup-visual-overlay" />
        
        <div className="signup-visual-inner">
          <Link to="/" className="signup-home-link" style={{ display: "inline-block", marginBottom: "2rem", textDecoration: "none", color: "var(--text-3)" }}>
            ← Back to store
          </Link>
          <div className="signup-visual-badge">Member Perks</div>
          <h2 className="signup-visual-title">
            Join the <em>Freshora Family</em>
          </h2>
          <p className="signup-visual-sub">
            Create an account today and enjoy a premium grocery experience hand-delivered straight from certified organic fields.
          </p>

          <div className="signup-perks-list">
            <div className="signup-perk-item">
              <div className="signup-perk-icon-wrap">🚚</div>
              <div className="signup-perk-text">
                <h4>Free & Fast Delivery</h4>
                <p>On all organic orders above ₹500 directly to your doorstep.</p>
              </div>
            </div>
            <div className="signup-perk-item">
              <div className="signup-perk-icon-wrap">🌱</div>
              <div className="signup-perk-text">
                <h4>100% Sourced Organic</h4>
                <p>Certified pesticide-free vegetables and seasonal fruits.</p>
              </div>
            </div>
            <div className="signup-perk-item">
              <div className="signup-perk-icon-wrap">⭐</div>
              <div className="signup-perk-text">
                <h4>Exclusive Deals</h4>
                <p>Access member-only promotions, surprise discounts, and reward points.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM SIDE ── */}
      <div className="signup-form-side">
        <div className="signup-form-card">
          <div className="signup-form-header-premium">
            <h1>Create Account</h1>
            <p>Join thousands of happy organic enthusiasts today</p>
          </div>

          <form onSubmit={handleSignup} className="signup-form" noValidate>
            {errors.form && (
              <div style={{ padding: "10px", backgroundColor: "#fdecea", color: "#e74c3c", borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem" }}>
                {errors.form}
              </div>
            )}
            
            <div className="sf-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors({...errors, username: ""}) }}
                placeholder="Choose a username"
                autoFocus
                style={{ borderColor: errors.username ? "#e74c3c" : undefined }}
              />
              {errors.username && <span style={{ color: "#e74c3c", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>{errors.username}</span>}
            </div>
            
            <div className="sf-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: ""}) }}
                placeholder="••••••••"
                style={{ borderColor: errors.password ? "#e74c3c" : undefined }}
              />
              {errors.password && <span style={{ color: "#e74c3c", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>{errors.password}</span>}
            </div>

            <div className="sf-group">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors({...errors, confirm: ""}) }}
                placeholder="••••••••"
                style={{ borderColor: errors.confirm ? "#e74c3c" : undefined }}
              />
              {errors.confirm && <span style={{ color: "#e74c3c", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>{errors.confirm}</span>}
            </div>

            <button type="submit" className="signup-submit-btn" disabled={loading} style={{ marginTop: "1rem" }}>
              {loading ? "Creating your account..." : "Register Now →"}
            </button>
          </form>

          <p className="signup-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
