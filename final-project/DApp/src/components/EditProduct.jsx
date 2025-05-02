import React, { useState, useEffect } from "react";
import "./ProductForm.css";
import { pinata } from "../utils/ipfs.js";
import { BrowserProvider, Contract } from "ethers";
import { contractAddress, abi } from "../Olx.json";
import { useLocation } from "react-router-dom";
const EditProduct = () => {
  const id = useLocation()?.state?.id;
  
  const [uploading, setUploading] = useState(false);
  const [signer, setSigner] = useState();
  const [Product, setProduct] = useState({
    id: id,
    name: "",
    description: "",
    price: 0,
    category: "",
    imageURL: "",
  });

  useEffect(() => {
    const connectToMetaMask = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
        alert("Connected to MetaMask");
      } catch (error) {
        console.error(error);
        alert("Error connecting to MetaMask");
      }
    };
    connectToMetaMask();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploading) {
      console.log("Upload in progress. Please wait...");
      return;
    }
    try {
      console.log(Product);
      const editProduct = async () => {
        const contract = new Contract(contractAddress, abi, signer);
        console.log(...Object.values(Product));
  
        try {
          await contract.editProduct(...Object.values(Product));
        } catch (error) {
          console.error(error);
          alert("Error editing product: Product Sold",error);
          
        }
        alert("Product edited successfully");
      };
      editProduct();
    } catch (error) {
      console.error(error);
      alert("Error editing product",error);
      
    }
  };

  const handleUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const upload = await pinata.upload.file(file);
    console.log(upload);
    const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
    console.log(ipfsUrl);
    setUploading(false);
    setProduct({ ...Product, imageURL: ipfsUrl }); // Return IPFS URL
  };

  return (
    <>
      { (
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>Edit Product</h2>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={Product.name}
              onChange={(e) => setProduct({ ...Product, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={Product.description}
              onChange={(e) =>
                setProduct({ ...Product, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (Rs.)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={Product.price}
              onChange={(e) =>
                setProduct({ ...Product, price: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-category">Category</label>
            <select id="product-category" className="dropdown">
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home-appliances">Home Appliances</option>
              <option value="books">Books</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => handleUpload(e)}
              required
            />
          </div>
          <button type="submit" disabled={uploading} className="submit-button">
            {uploading ? "Loading..." : "Edit Product"}
          </button>
        </form>
      )}
    </>
  );
};

export default EditProduct;
