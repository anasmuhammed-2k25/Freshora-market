import React from "react";
import { Routes, Route } from "react-router-dom";
import { ItemProvider } from "./context/ItemContext";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";

function App() {
  return (
    <ItemProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ItemProvider>
  );
}

export default App;
