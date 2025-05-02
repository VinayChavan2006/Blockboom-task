import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { BrowserProvider, Contract } from "ethers";
import { contractAddress, abi } from "../Olx.json";
const Navbar = ({
  setSearchQuery,
  setSelectedCategory,
  selectedCategory,
  searchQuery,
  filterByCategory,
  filterByQuery,
}) => {
  const [clickCount,setClickCount] = useState(0);
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState([]);

  const provider = new BrowserProvider(window.ethereum);
  const connectToMetaMask = async () => {
    setClickCount(clickCount+1);
    try {
      const signer = await provider.getSigner();
      if (signer) {
        setAddress(signer.address);
        alert("Connected to MetaMask",address);
      }
      const contract = new Contract(contractAddress, abi, signer);
      const categories = [];
      for (let i = 0; i < 5; i++) {
        categories.push(await contract.categories(i));
      }
      setCategories(categories);

      //alert("Connected to MetaMask");
    } catch (error) {
      console.error(error);
      //alert("Error connecting to MetaMask");
    }
  };

  const handleCategoryFilter = (e) => {
    
    setSelectedCategory(e.target.value);
    filterByCategory();
  }

  const handleQueryFilter = (e) => {
    setSearchQuery(e.target.value);
    filterByQuery();
  }

  useEffect(() => {
    if(clickCount > 0){
      connectToMetaMask();
    }
    
  }, []);
  return (
    <>
      <nav>
        <div className="logo" onClick={() => (window.location.href = "/")}>
          <img
            src="https://img.icons8.com/?size=100&id=HoN5DART1Bu1&format=png&color=000000"
            alt="Logo"
          />
        </div>
        {/* <div className="category">
          <select
            id="product-category"
            className="dropdown"
            onChange={(e) => handleCategoryFilter(e)}
          >
            {categories.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
        </div> */}
        <div className="search">
          <div className="searchbar">
            <input
              type="text"
              name="productName"
              id="productName"
              placeholder="Search Products"
              onChange={(e) => handleQueryFilter(e)}
            />
          </div>
          <div className="searchIcon">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 50 50"
              >
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="connect">
          <button onClick={connectToMetaMask}>Connect to MetaMask</button>
          {"  "}
          {true && (
            <div className="user-dropdown">
              <button className="dropdown-button">
                <img
                  src="https://img.icons8.com/ios-filled/50/ffffff/user.png"
                  alt="User Icon"
                  className="user-icon"
                />
              </button>
              <div className="dropdown-menu">
                <a href="/products" className="dropdown-item">
                  Posted Products
                </a>
                <a href="/bought-products" className="dropdown-item">
                  Bought Products
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="post">
          <button onClick={() => (window.location.href = "/post")}>
            Post Product
          </button>
        </div>
      </nav>
      <p
        style={{ color: "#002f34", fontFamily: "sans-serif" }}
      >{address && `Connected to address: ${address}`}</p>
    </>
  );
};

export default Navbar;
