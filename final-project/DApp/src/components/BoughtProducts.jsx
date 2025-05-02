import React, { useState, useEffect } from "react";
import "./UserProducts.css";
import { BrowserProvider, Contract } from "ethers";
import { contractAddress, abi } from "../Olx.json";
const BoughtProducts = () => {
  const [address, setAddress] = useState("");
  const [boughtProducts, setBoughtProducts] = useState([]);
  const provider = new BrowserProvider(window.ethereum);
  const connectToMetaMask = async () => {
    try {
      const signer = await provider.getSigner();
      if (signer) {
        setAddress(signer.address);
      }
      const contract = new Contract(contractAddress, abi, signer);
      const buys = [];
      let productCount = await contract.boughtProductsCount();
      for (let i = 0; i < productCount; i++) {
        buys.push(await contract.userBoughtProducts(signer.address, i));
      }
      setBoughtProducts(buys);
    } catch (error) {
      console.error(error);
      alert("Error connecting to MetaMask");
    }
  };

  useEffect(() => {
    connectToMetaMask();
  }, [provider]);
  return (
    <>
      <div className="user-products-page">
        <h1 className="page-title">Your Bought Products</h1>
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {boughtProducts.length>0 ? (
              boughtProducts.map((product) => (
                <tr>
                  <td>
                    <img
                      src={product.imageURL}
                      alt="Product"
                      className="product-Image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{parseInt(product.price)}</td>
                </tr>
              ))
            ) : (
              <p>No Products Bought</p>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BoughtProducts;
