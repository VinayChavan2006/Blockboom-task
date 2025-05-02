import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductForm from "./components/ProductForm.jsx";
import Navbar from "./components/Navbar.jsx";
import UserProducts from "./components/UserProducts.jsx";
import BoughtProducts from "./components/BoughtProducts.jsx";
import EditProduct from "./components/EditProduct.jsx";



createRoot(document.getElementById("root")).render(
  <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post" element={<ProductForm />} />
        <Route path="/products" element={<UserProducts />} />
        <Route path="/edit" element={<EditProduct/>} />
        <Route path="/bought-products" element={<BoughtProducts />} />
      </Routes>
    </BrowserRouter>
  </>
);
