import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  return (
    <footer className="site-footer">

      {/* ── TOP HALF — Dark ── */}
      <div className="footer-dark">
        <div className="footer-dark-inner">

          {/* Big brand statement */}
          <div className="footer-statement-col">
            <p className="footer-statement-label">FRESHORA MART</p>
            <h2 className="footer-statement">
              Fresh.<br />
              <span className="footer-statement-accent">Always.</span>
            </h2>
            <p className="footer-tagline">Farm-direct produce. No middlemen. No compromise. Delivering health and joy to every home, freshly sourced and thoughtfully packed from local farms directly to your doorstep.</p>
            <div className="footer-socials">
              {["IG", "FB", "TW", "YT"].map(s => (
                <a href="#" key={s} className="footer-social-btn">{s}</a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="footer-nav-grid">
            <div className="footer-nav-col">
              <p className="footer-nav-heading">SHOP</p>
              <ul>
                {["All Products", "Fresh Fruits", "Vegetables", "Bundles", "Seasonal Picks"].map(l => (
                  <li key={l}><Link to="/products">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div className="footer-nav-col">
              <p className="footer-nav-heading">HELP</p>
              <ul>
                {["FAQ", "Shipping", "Returns", "Order Status", "Accessibility"].map(l => (
                  <li key={l}><Link to="#">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div className="footer-nav-col">
              <p className="footer-nav-heading">ACCOUNT</p>
              <ul>
                {["My Account", "Cart", "Wishlist", "Terms of Use", "Privacy Policy"].map(l => (
                  <li key={l}><Link to="#">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-nl-col">
            <p className="footer-nav-heading">STAY FRESH</p>
            <p className="footer-nl-desc">Weekly deals & seasonal drops, straight to your inbox.</p>
            {sent ? (
              <p className="footer-nl-sent">✓ You're in! Check your inbox.</p>
            ) : (
              <form className="footer-nl-form" onSubmit={handleSend}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="footer-nl-input"
                  required
                />
                <button type="submit" className="footer-nl-btn">→</button>
              </form>
            )}
            <div className="footer-contact">
              <span>📍 Kochi, Kerala 682024</span>
              <span>✉ hello@freshoramart.com</span>
            </div>
          </div>

        </div>
      </div>



    </footer>
  );
};

export default Footer;
