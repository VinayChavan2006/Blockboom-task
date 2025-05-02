import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import ProductForm from "./components/ProductForm";
import { BrowserProvider, Contract } from "ethers";
import { contractAddress, abi } from "./Olx.json";

function App() {
  // 0x083F7BBA7DF389a9279023740a1Fb6F42eCf252D

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered product list
  const [selectedCategory, setSelectedCategory] = useState(""); // Current category filter
  const [searchQuery, setSearchQuery] = useState("");
  const [signer, setSigner] = useState();

  useEffect(() => {
    const connectToMetaMask = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
        const contract = new Contract(contractAddress, abi, signer);
        const products = [];
        const productCount = await contract.nextProductId();
        console.log(productCount);

        for (let i = 0; i < productCount; i++) {
          products.push(await contract.AllProducts(i));
        }
        console.log(products[0].price);

        setProducts(products);
        setFilteredProducts(products);
        alert("Connected to MetaMask",signer.address);
      } catch (error) {
        console.error(error);
        alert("Error connecting to MetaMask");
      }
    };
    connectToMetaMask();
  }, []);

  const filterByCategory = () => {
    if (selectedCategory?.length > 0) {
      console.log(products[2].category);
      
      let filtered = filteredProducts.filter((product) => product?.category.toLowerCase() === selectedCategory.toLowerCase());
      console.log(filtered);
      
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };
  const filterByQuery = () => {
    if (searchQuery == "") {
      setFilteredProducts(products);
    } else {
      const filtered = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };
  useEffect(() => {
    if(selectedCategory.length>0 && searchQuery == ""){
      filterByCategory();
    }else{
      filterByCategory();
      filterByQuery();
    }
    
  }, [selectedCategory,searchQuery]);

  return (
    <>
      <Navbar
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        filterByCategory={filterByCategory}
        filterByQuery={filterByQuery}
      />
      <div
        className="product-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
          padding: "10px",
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) =>
            product.sold || product.price == 0 ? null : (
              <Product
                key={product.id}
                id={product.id}
                productName={product.name}
                description={product.description}
                imageURL={product.imageURL}
                price={parseInt(product.price)}
              />
            )
          )
        ) : (
          <h1 style={{ color: "#002f34", textAlign: "center" }}>
            No products found
          </h1>
        )}
      </div>
    </>
  );
}

export default App;
