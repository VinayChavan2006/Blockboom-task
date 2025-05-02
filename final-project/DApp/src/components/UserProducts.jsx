import React, { useEffect, useState } from "react";
import "./UserProducts.css";
import { BrowserProvider, Contract } from "ethers";
import { contractAddress, abi } from "../Olx.json";
import { useNavigate } from "react-router-dom";
const UserProducts = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [AllProducts, setAllProducts] = useState([]);
  const [postedProducts, setPostedProducts] = useState([]);
  const provider = new BrowserProvider(window.ethereum);
  const connectToMetaMask = async () => {
    try {
      const signer = await provider.getSigner();
      if (signer) {
        setAddress(signer.address);
      }
      const contract = new Contract(contractAddress, abi, signer);
      let allProds = [];
      let total = await contract.nextProductId();
      for (let i = 0; i < total; i++) {
        allProds.push(await contract.AllProducts(i));
      }
      setAllProducts(allProds);
      const posts = [];
      let productCount = await contract.userProductsCount();
      for (let i = 0; i < productCount; i++) {
        if (AllProducts[i]?.price > 0) {
          
          posts.push(await contract.userToProductsMap(signer.address, i));
        }
      }
      setPostedProducts(posts);
    } catch (error) {
      console.error(error);
      alert("Error connecting to MetaMask");
    }
  };

  useEffect(() => {
    connectToMetaMask();
  }, [provider]);

  const handleEdit = (id) => {
    navigate("/edit", { state: { id: id } });
  };
  const handleDelete = async (id) => {
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    await contract.deleteProduct(id);
    alert("Product Deleted Successfully");
    connectToMetaMask();
  };
  return (
    <>
      <div className="user-products-page">
        <h1 className="page-title">Your Posted Products</h1>
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {postedProducts.map(
              (product) =>
                parseInt(product.price) > 0 && (
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
                    <td>
                      {parseInt(product.price)} {"Gwei"}
                    </td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(parseInt(product.id))}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(parseInt(product.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserProducts;
