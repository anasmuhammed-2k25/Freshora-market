import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useItems } from "../context/ItemContext";
import ProductItem from "../components/ProductItem";

/* ── tiny hook: is element visible? ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const SLIDES = [
  { image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1400&h=700&fit=crop", sub: "100% Certified Organic", title: "Premium Vegetables", badge: "🌿 Farm Fresh • 30% Off" },
  { image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1400&h=700&fit=crop", sub: "Locally Sourced Daily", title: "Tropical Fruits", badge: "🍋 Seasonal Picks • BOGO" },
  { image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1400&h=700&fit=crop", sub: "Zero Preservatives", title: "Root & Vine", badge: "🥕 Up to 40% Off" },
];

const CATEGORIES = [
  { icon: "🍎", label: "Fresh Fruits", count: "80+ Items", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop" },
  { icon: "🥦", label: "Vegetables", count: "120+ Items", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop" },

];

const BENEFITS = [
  { icon: "🌱", title: "100% Organic", desc: "Certified by FSSAI. No pesticides, no chemicals — ever." },
  { icon: "⚡", title: "Same-Day Delivery", desc: "Order before 2 PM, delivered fresh to your door by evening." },
  { icon: "🧑‍🌾", title: "Direct from Farm", desc: "We cut out the middlemen. You get fresher produce at better prices." },
  { icon: "♻️", title: "Zero Waste Packing", desc: "100% biodegradable packaging. Good for you, good for the planet." },
  { icon: "💯", title: "Freshness Guarantee", desc: "Not happy? Full refund, no questions asked. That's our promise." },
  { icon: "🔒", title: "Secure Payments", desc: "Razorpay-powered checkout. Your data is always encrypted & safe." },
];

const TESTIMONIALS = [
  { name: "Priya S.", city: "Kozhikode", rating: 5, text: "Absolutely love Freshora! The mangoes are the juiciest I've ever had. Same-day delivery is a game changer." },
  { name: "Rahul M.", city: "Kochi", rating: 5, text: "Finally a place where I trust the organic label. You can taste the difference. My whole family switched." },
  { name: "Anitha K.", city: "Thrissur", rating: 5, text: "Customer service is excellent and the vegetables stay fresh for days. Worth every rupee!" },
];

const BLOGS = [
  { tag: "Nutrition", title: "5 Superfoods That Boost Immunity Naturally", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=320&fit=crop", date: "May 20, 2026" },
  { tag: "Farming", title: "How We Source Directly From Kerala Farms", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=320&fit=crop", date: "May 15, 2026" },
  { tag: "Recipes", title: "Quick 20-Minute Meals With Seasonal Vegetables", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&h=320&fit=crop", date: "May 10, 2026" },
];

const STATS = [
  { number: "200+", label: "Products" },
  { number: "5K+", label: "Happy Customers" },
  { number: "50+", label: "Farm Partners" },
  { number: "100%", label: "Organic Certified" },
];

export default function Home() {
  const { products, loading, error } = useItems();
  const featuredProducts = products.slice(0, 8);

  const [slide, setSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hrs: 14, mins: 30, secs: 0 });
  const [activeFaq, setActiveFaq] = useState(null);

  const [heroRef, heroVisible] = useInView(0.1);
  const [benefitsRef, benefitsVisible] = useInView(0.1);
  const [categoriesRef, categoriesVisible] = useInView(0.1);
  const [statsRef, statsVisible] = useInView(0.1);
  const [testimonialsRef, testimonialsVisible] = useInView(0.1);
  const [blogRef, blogVisible] = useInView(0.1);

  /* countdown removed per request */

  /* auto-slide */
  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { q: "How fresh are your products?", a: "We harvest or source every item within 24 hours of delivery. Our farm-to-door cycle is typically under 36 hours." },
    { q: "Do you deliver across Kerala?", a: "Yes! We deliver across all major cities in Kerala including Kochi, Kozhikode, Thrissur, Thiruvananthapuram, and more." },
    { q: "What if I'm not satisfied with my order?", a: "We offer a 100% freshness guarantee. If you're not happy, we'll replace the item or give you a full refund — no hassle." },
    { q: "Are your products really organic?", a: "Absolutely. All products are FSSAI certified organic. We work exclusively with farms that follow zero-chemical farming practices." },
  ];

  return (
    <div className="home-container">

      {/* ══════════════════ HERO SLIDER ══════════════════ */}
      <section className="hs-hero" ref={heroRef}>
        {SLIDES.map((s, i) => (
          <div key={i} className={`hs-slide ${i === slide ? "hs-slide--active" : ""}`}>
            <img src={s.image} alt={s.title} className="hs-slide-img" />
            <div className="hs-slide-overlay" />
          </div>
        ))}
        <div className={`hs-hero-content ${heroVisible ? "hs-fade-up" : ""}`}>
          
          <h1 className="hs-hero-title">{SLIDES[slide].title}</h1>
          <p className="hs-hero-desc">Handpicked from certified organic farms across Kerala. Delivered to your door within hours — fresher than the supermarket, every time.</p>
          <div className="hs-hero-btns">
            <Link to="/products" className="hs-btn-primary">Shop Now →</Link>
            <Link to="/orders" className="hs-btn-ghost">Track Order</Link>
          </div>
        </div>
        {/* Slide controls */}
        <div className="hs-controls">
          <button className="hs-ctrl" onClick={() => setSlide(p => (p - 1 + SLIDES.length) % SLIDES.length)}>‹</button>
          <div className="hs-dots">
            {SLIDES.map((_, i) => <button key={i} className={`hs-dot ${i === slide ? "hs-dot--active" : ""}`} onClick={() => setSlide(i)} />)}
          </div>
          <button className="hs-ctrl" onClick={() => setSlide(p => (p + 1) % SLIDES.length)}>›</button>
        </div>
      </section>

      {/* ══════════════════ STATS BAR ══════════════════ */}
      <section className="hs-stats-bar" ref={statsRef}>
        {STATS.map((s, i) => (
          <div key={i} className={`hs-stat ${statsVisible ? "hs-fade-up" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="hs-stat-num">{s.number}</span>
            <span className="hs-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

     {/* ══════════════════ CATEGORIES ══════════════════ */}
<section className="hs-section" ref={categoriesRef}>
  <div className="hs-section-header">
    <span className="hs-eyebrow">Browse by Category</span>
    <h2 className="hs-section-title">What Are You Looking For?</h2>
  </div>
  <div className="hs-two-col-categories">

    {/* FRESH FRUITS */}
    <Link to="/products" className="hs-cat-hero-card">
      <img src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=500&fit=crop" alt="Fresh Fruits" />
      <div className="hs-cat-hero-overlay">
        
        <h3>Fresh Fruits</h3>
        <p>80+ varieties harvested daily from certified organic farms</p>
        <span className="hs-cat-card-btn">Shop Fruits →</span>
      </div>
    </Link>

    {/* VEGETABLES */}
    <Link to="/products" className="hs-cat-hero-card">
      <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=500&fit=crop" alt="Vegetables" />
      <div className="hs-cat-hero-overlay">
  
        <h3>Vegetables</h3>
        <p>120+ varieties, zero chemicals, straight from Kerala farms</p>
        <span className="hs-cat-card-btn">Shop Vegetables →</span>
      </div>
    </Link>

  </div>
</section>

      {/* ══════════════════ DEAL BANNER ══════════════════ */}
      <section className="hs-deal-banner">
        <div className="hs-deal-left">
          <span className="hs-deal-tag"> Flash Deal</span>
          <h2 className="hs-deal-headline">Save <span className="hs-deal-pct">25%</span> on Everything on Anniversary</h2>
          <p className="hs-deal-sub">Limited time offer on our full catalog. Farm-fresh prices, zero compromise.</p>
          
          <Link to="/products" className="hs-btn-primary" style={{ display: "inline-block", marginTop: "1.5rem" }}>Grab the Deal →</Link>
        </div>
        <div className="hs-deal-right">
          <div className="hs-deal-img-wrap">
            <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=600&fit=crop" alt="Fresh Produce Deal" className="hs-deal-img" />
            <div className="hs-deal-badge">BEST<br/>PRICE</div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURED PRODUCTS ══════════════════ */}
      <section className="hs-section">
        <div className="hs-section-header">
          <span className="hs-eyebrow">Handpicked for You</span>
          <h2 className="hs-section-title">Featured Products</h2>
          <Link to="/products" className="hs-btn-outline">View All →</Link>
        </div>
        {loading && <p style={{ color: "var(--text-3)", textAlign: "center", padding: "2rem" }}>Loading fresh picks…</p>}
        {error && <p style={{ color: "#ef6060", textAlign: "center" }}>Error loading products.</p>}
        {!loading && !error && (
          <div className="products-grid">
            {featuredProducts.map(p => <ProductItem key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ══════════════════ WHY CHOOSE US ══════════════════ */}
      <section className="hs-benefits-section" ref={benefitsRef}>
        <div className="hs-benefits-header">

          <h2 className="hs-benefits-title">The Freshora Difference</h2>
          <p className="hs-benefits-sub">We're not just another grocery store. We're a movement toward healthier, more sustainable eating.</p>
        </div>
        <div className="hs-benefits-grid">
          {BENEFITS.map((b, i) => (
            <div key={i} className={`hs-benefit-card ${benefitsVisible ? "hs-fade-up" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="hs-benefit-icon">{b.icon}</span>
              <h3 className="hs-benefit-title">{b.title}</h3>
              <p className="hs-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ PROMO CARDS ══════════════════ */}
      <section className="hs-section">
        <div className="hs-promo-grid">
          <div className="hs-promo-card hs-promo-card--green">
            <div className="hs-promo-text">
              <span className="hs-promo-eyebrow">New Arrivals</span>
              <h3>Seasonal Picks<br/>Just In 🍋</h3>
              <Link to="/products" className="hs-btn-white">Shop Now →</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=350&fit=crop" alt="Seasonal" className="hs-promo-img" />
          </div>
          <div className="hs-promo-card hs-promo-card--gold">
            <div className="hs-promo-text">
              <span className="hs-promo-eyebrow">Bundle & Save</span>
              <h3>Family Veggie<br/>Box 🥕</h3>
              <Link to="/products" className="hs-btn-white">Explore →</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=350&fit=crop" alt="Bundle" className="hs-promo-img" />
          </div>
          <div className="hs-promo-card hs-promo-card--dark">
            <div className="hs-promo-text">
              <span className="hs-promo-eyebrow">Premium</span>
              <h3>Exotic Fruits<br/>Collection 🫐</h3>
              <Link to="/products" className="hs-btn-white">Discover →</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=350&fit=crop" alt="Exotic" className="hs-promo-img" />
          </div>
        </div>
      </section>

   

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="hs-section">
        <div className="hs-section-header">
          <span className="hs-eyebrow">Simple Process</span>
          <h2 className="hs-section-title">How It Works</h2>
        </div>
        <div className="hs-steps">
          {[
            { step: "01", icon: "🛒", title: "Browse & Add", desc: "Explore our fresh catalog and add your favourite items to the cart." },
            { step: "02", icon: "💳", title: "Secure Checkout", desc: "Pay safely via Razorpay — UPI, cards, wallets all accepted." },
            { step: "03", icon: "🚚", title: "We Harvest & Pack", desc: "Your order triggers a fresh harvest from our partner farms." },
            { step: "04", icon: "🏠", title: "Delivered Fresh", desc: "Your organic produce arrives at your door within hours." },
          ].map((s, i) => (
            <div key={i} className="hs-step">
              <div className="hs-step-num">{s.step}</div>
              <div className="hs-step-icon">{s.icon}</div>
              <h3 className="hs-step-title">{s.title}</h3>
              <p className="hs-step-desc">{s.desc}</p>
              {i < 3 && <div className="hs-step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

   

      {/* ══════════════════ FAQ ══════════════════ */}
      <section className="hs-faq-section">
        <div className="hs-faq-inner">
          <div className="hs-section-header" style={{ marginBottom: "2rem" }}>
            <span className="hs-eyebrow">Got Questions?</span>
            <h2 className="hs-section-title">Frequently Asked</h2>
          </div>
          <div className="hs-faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`hs-faq-item ${activeFaq === i ? "hs-faq-item--open" : ""}`}>
                <button className="hs-faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  {f.q}
                  <span className="hs-faq-icon">{activeFaq === i ? "−" : "+"}</span>
                </button>
                {activeFaq === i && <p className="hs-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
