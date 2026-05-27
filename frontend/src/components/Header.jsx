import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useItems } from "../context/ItemContext";

const Header = () => {
  const { cartCount } = useItems();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setToken(null);
    setUsername(null);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-inner">

        {/* ── BRAND (left) ── */}
        <div className="brand">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div>
              <h1 className="brand-name">Freshora Mart</h1>
              <p className="brand-tagline">Farm to your door</p>
            </div>
          </Link>
        </div>

        {/* ── PAGE LINKS (center) ── */}
        <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMobileMenuOpen(false)}>Products</NavLink>
          {isAdmin && token && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMobileMenuOpen(false)}>Admin</NavLink>
          )}
        </nav>

        {/* ── RIGHT ACTIONS ── */}
        <div className="nav-actions">
          {/* Orders button */}
          <Link to="/orders" className="cart-icon-btn" aria-label="View orders" style={{ marginRight: "4px" }} title="My Orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </Link>

          {/* Cart button */}
          <Link to="/cart" className="cart-icon-btn" aria-label="View cart" style={{ marginRight: "4px" }} title="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {token ? (
            <div className="nav-profile-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="nav-username" style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--sage-light)",
                letterSpacing: "0.02em"
              }}>
                Hi, {username || "User"}
              </span>
              <button 
                onClick={handleLogout} 
                className="nav-btn nav-btn-ghost" 
                style={{
                  fontSize: "0.78rem",
                  padding: "6px 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  borderRadius: "var(--r-sm)"
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="nav-btn nav-btn-solid" 
              style={{
                fontSize: "0.78rem",
                padding: "8px 16px",
                textDecoration: "none",
                borderRadius: "var(--r-sm)"
              }}
            >
              Login
            </Link>
          )}

          {/* Hamburger Menu Toggle */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
