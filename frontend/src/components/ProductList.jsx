import React from "react";
import { useItems } from "../context/ItemContext";
import ProductItem from "./ProductItem";

const ProductList = () => {
  const {
    products, loading, error,
    selectedCategory, setSelectedCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    sortOrder, setSortOrder,
  } = useItems();

  const categories = ["All", "Fruit", "Vegetable"];

  const handleReset = () => {
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("");
  };

  return (
    <div className="shop-layout">

      {/* ── SIDEBAR FILTERS ── */}
      <aside className="filter-sidebar">
        <div className="filter-sidebar-header">
          <h2>Filters</h2>
          <button className="filter-reset-btn" onClick={handleReset}>Reset all</button>
        </div>

        {/* Category */}
        <div className="filter-block">
          <h3 className="filter-block-title">Category</h3>
          <div className="filter-category-list">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-cat-item ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span className="filter-cat-icon">
                  {cat === "All" ? "🌿" : cat === "Fruit" ? "🍎" : "🥦"}
                </span>
                <span>{cat}</span>
                {selectedCategory === cat && <span className="filter-cat-check">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-block">
          <h3 className="filter-block-title">Price Range (₹)</h3>
          <div className="filter-price-stack">
            <div className="filter-price-field">
              <label>Min</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="filter-price-input"
                min="0"
              />
            </div>
            <div className="filter-price-dash">—</div>
            <div className="filter-price-field">
              <label>Max</label>
              <input
                type="number"
                placeholder="∞"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="filter-price-input"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="filter-block">
          <h3 className="filter-block-title">Sort By</h3>
          <div className="filter-sort-options">
            {[
              { value: "", label: "Default" },
              { value: "price_asc", label: "Price: Low → High" },
              { value: "price_desc", label: "Price: High → Low" },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`filter-sort-item ${sortOrder === opt.value ? "active" : ""}`}
                onClick={() => setSortOrder(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── PRODUCT GRID ── */}
      <main className="shop-main">
        {/* Results bar */}
        {!loading && !error && (
          <div className="shop-results-bar">
            <span className="shop-results-count">
              <strong>{products.length}</strong> product{products.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && (
                <span className="shop-active-filter">
                  {selectedCategory === "Fruit" ? "🍎" : "🥦"} {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")} className="filter-pill-x">✕</button>
                </span>
              )}
            </span>
          </div>
        )}

        {loading && (
          <div className="state-container">
            <div className="spinner" />
            <p className="state-text">Loading fresh produce...</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-container">
            <span className="state-icon">⚠️</span>
            <p className="state-text">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state-container">
            <span className="state-icon">🔍</span>
            <p className="state-text">No products match your filters</p>
            <button className="filter-reset-btn" onClick={handleReset} style={{ marginTop: "1rem" }}>
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;
