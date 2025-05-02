import React from "react";
import "./Product.css";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { contractAddress, abi } from "../Olx.json";

const Product = ({ id, productName, description, price, imageURL }) => {
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState();

  const provider = new BrowserProvider(window.ethereum);
  const connectToMetaMask = async () => {
    try {
      const signer = await provider.getSigner();
      setSigner(signer);
      if (signer) {
        setAddress(signer.address);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to MetaMask");
    }
  };
  
  const handleBuy = async () => {
    const valueInGwei = ethers.parseUnits(price.toString(), "gwei");
    const contract = new Contract(contractAddress, abi, signer);
    try {
      await contract.buyProduct(id,{
        value: valueInGwei,
      });
      alert("Product bought successfully");
    } catch (error) {
      console.error(error);
      alert("Error buying product");
    }
  };
  useEffect(() => {
    connectToMetaMask();
  }, [provider]);
  return (
    <>
      <div className="product-card">
        <div className="product-image">
          <img src={imageURL} alt="Product Image" />
        </div>
        <div className="product-details">
          <h3 className="product-name">{productName}</h3>
          <p className="product-desc">{description}</p>
          <div className="purchase">
            <p className="product-price">Rs.{price}</p>
            <button className="buy-now" onClick={handleBuy}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
