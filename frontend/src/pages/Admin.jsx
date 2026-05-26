import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const [token] = useState(localStorage.getItem("token"));
  const [isAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Fruit");
  const [newImage, setNewImage] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("Fruit");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const API_URL = "/api";

  useEffect(() => {
    if (token && isAdmin) {
      fetchProducts();
      fetchUsers();
    }
  }, [token, isAdmin]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out admin users — only show regular users
      const nonAdminUsers = res.data.data.filter(u => u.role !== "admin");
      setUsers(nonAdminUsers);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/products`, {
        name: newName,
        price: Number(newPrice),
        category: newCategory,
        image: newImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
        description: newDescription || "Premium organic produce",
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Product added successfully!");
      setNewName(""); setNewPrice(""); setNewCategory("Fruit"); setNewImage(""); setNewDescription("");
      fetchProducts();
    } catch {
      alert("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Remove this product from the catalog?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditCategory(product.category);
    setEditImage(product.image);
    setEditDescription(product.description || "");
  };

  const handleCancelEdit = () => setEditingProduct(null);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/products/${editingProduct._id}`, {
        name: editName, price: Number(editPrice), category: editCategory,
        image: editImage, description: editDescription,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setEditingProduct(null);
      fetchProducts();
    } catch {
      alert("Failed to update product");
    }
  };

  // Only delete for users — no promote/demote
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Permanently delete this user account?")) return;
    try {
      const res = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || "User deleted.");
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (!token || !isAdmin) return <Navigate to="/login" replace />;

  const tabs = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "products", label: "Products", icon: "⊞" },
    { id: "users", label: "Users", icon: "⊙" },
  ];

  return (
    <div className="admin-dashboard" style={{ paddingBottom: "6rem" }}>

      {/* ── PAGE HEADER ── */}
      <div className="adm-page-header">
        <div className="adm-title-block">
          <div className="adm-eyebrow">Executive Portal</div>
          <h2 className="adm-title">Admin Dashboard</h2>
          <p className="adm-subtitle">Manage your catalog, monitor platform activity, and oversee registered members.</p>
        </div>

        <div className="adm-tab-rail">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`adm-tab-btn ${activeTab === t.id ? "adm-tab-btn--active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="adm-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="adm-overview">
          <div className="adm-kpi-row">
            <div className="adm-kpi-card adm-kpi-card--green">
            
              <div className="adm-kpi-body">
                <span className="adm-kpi-label">Total Catalog</span>
                <div className="adm-kpi-value">{products.length}<span className="adm-kpi-unit"> items</span></div>
              </div>
              <div className="adm-kpi-glow" />
            </div>

            <div className="adm-kpi-card adm-kpi-card--gold">
            
              <div className="adm-kpi-body">
                <span className="adm-kpi-label">Registered Users</span>
                <div className="adm-kpi-value">{users.length}<span className="adm-kpi-unit"> members</span></div>
              </div>
              <div className="adm-kpi-glow" />
            </div>

            <div className="adm-kpi-card adm-kpi-card--sage">
           
              <div className="adm-kpi-body">
                <span className="adm-kpi-label">Platform Status</span>
                <div className="adm-kpi-value adm-kpi-value--status">Active</div>
              </div>
              <div className="adm-kpi-glow" />
            </div>
          </div>

          <div className="adm-welcome-card">
            <div className="adm-welcome-left">
              <div className="adm-welcome-badge"> Executive Access</div>
              <h3 className="adm-welcome-title">Welcome back to the command centre.</h3>
              <p className="adm-welcome-text">
                Use the tabs above to manage organic items in the store catalog, review registered customer accounts, and keep the platform running smoothly.
              </p>
              <div className="adm-quick-actions">
                <button className="adm-qa-btn" onClick={() => setActiveTab("products")}>
                  <span>⊞</span> Manage Products
                </button>
                <button className="adm-qa-btn adm-qa-btn--outline" onClick={() => setActiveTab("users")}>
                  <span>⊙</span> View Users
                </button>
              </div>
            </div>
            <div className="adm-welcome-right">
              <div className="adm-stat-stack">
                <div className="adm-stat-line">
                  <span>Fruits in catalog</span>
                  <strong>{products.filter(p => p.category === "Fruit").length}</strong>
                </div>
                <div className="adm-stat-line">
                  <span>Vegetables in catalog</span>
                  <strong>{products.filter(p => p.category === "Vegetable").length}</strong>
                </div>
                <div className="adm-stat-line">
                  <span>Customer accounts</span>
                  <strong>{users.length}</strong>
                </div>
                <div className="adm-stat-line">
                  <span>System health</span>
                  <strong className="adm-stat-green">● Operational</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === "products" && (
        <div className="adm-products-layout">

          {/* Add Product Form */}
          <div className="adm-form-panel">
            <div className="adm-panel-header">
              <h3 className="adm-panel-title">Add Product</h3>
              <p className="adm-panel-sub">New item to the catalog</p>
            </div>
            <form onSubmit={handleAddProduct} className="adm-form">
              <div className="adm-field">
                <label className="adm-field-label">Product Name</label>
                <input className="adm-input" type="text" placeholder="e.g. Organic Mango" value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Price (₹ / kg)</label>
                <input className="adm-input" type="number" placeholder="e.g. 120" value={newPrice} onChange={e => setNewPrice(e.target.value)} required />
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Category</label>
                <select className="adm-input" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  <option value="Fruit">🍎 Fruit</option>
                  <option value="Vegetable">🥦 Vegetable</option>
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Image URL <span style={{color:"var(--text-4)"}}>— optional</span></label>
                <input className="adm-input" type="text" placeholder="https://..." value={newImage} onChange={e => setNewImage(e.target.value)} />
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Description <span style={{color:"var(--text-4)"}}>— optional</span></label>
                <textarea className="adm-input adm-textarea" placeholder="Short product description…" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
              </div>
              <button type="submit" className="adm-submit-btn">
                <span>＋</span> Add to Catalog
              </button>
            </form>
          </div>

          {/* Products Table */}
          <div className="adm-table-panel">
            <div className="adm-panel-header adm-panel-header--row">
              <div>
                <h3 className="adm-panel-title">Catalog ({products.length})</h3>
                <p className="adm-panel-sub">All products currently listed in the store</p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="adm-product-cell">
                          <img src={p.image} alt={p.name} className="adm-product-thumb" />
                          <span className="adm-product-name">{p.name}</span>
                        </div>
                      </td>
                      <td><span className="adm-price">₹{p.price}</span></td>
                      <td>
                        <span className={`adm-cat-badge adm-cat-badge--${p.category.toLowerCase()}`}>
                          {p.category === "Fruit" ? "🍎" : "🥦"} {p.category}
                        </span>
                      </td>
                      <td>
                        <div className="adm-action-group">
                          <button className="adm-btn-edit" onClick={() => handleStartEdit(p)}>Edit</button>
                          <button className="adm-btn-delete" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === "users" && (
        <div className="adm-table-panel adm-table-panel--full">
          <div className="adm-panel-header adm-panel-header--row">
            <div>
              <h3 className="adm-panel-title">Customer Accounts ({users.length})</h3>
              <p className="adm-panel-sub">Registered non-admin members on the platform</p>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "var(--text-4)" }}>
                      No customer accounts registered yet.
                    </td>
                  </tr>
                )}
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-user-avatar">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="adm-product-name">{u.username}</span>
                      </div>
                    </td>
                    <td>
                      <span className="adm-status-badge adm-status-badge--user">
                        👤 Customer
                      </span>
                    </td>
                    <td style={{ color: "var(--text-3)", fontSize: "0.82rem" }}>
                      {new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td>
                      <div className="adm-action-group">
                        <button className="adm-btn-delete" onClick={() => handleDeleteUser(u._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editingProduct && (
        <div className="adm-modal-backdrop" onClick={handleCancelEdit}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Edit Product</h3>
              <button className="adm-modal-close" onClick={handleCancelEdit}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="adm-form">
              <div className="adm-field">
                <label className="adm-field-label">Product Name</label>
                <input className="adm-input" type="text" value={editName} onChange={e => setEditName(e.target.value)} required />
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Price (₹ / kg)</label>
                <input className="adm-input" type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} required />
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Category</label>
                <select className="adm-input" value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                  <option value="Fruit">🍎 Fruit</option>
                  <option value="Vegetable">🥦 Vegetable</option>
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Image URL</label>
                <input className="adm-input" type="text" value={editImage} onChange={e => setEditImage(e.target.value)} />
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Description</label>
                <textarea className="adm-input adm-textarea" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
              </div>
              <div className="adm-modal-footer">
                <button type="submit" className="adm-submit-btn" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" className="adm-cancel-btn" onClick={handleCancelEdit} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
