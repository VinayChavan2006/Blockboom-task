// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;


contract Olx {
    struct Product{
        uint256 id;
        string name;
        string description;
        uint256 price;
        string category;
        string imageURL;
        address payable seller;
        address buyer;
        bool sold;
    }

    // Categories array
    string[] public categories = ["Electronics","Fashion","Home Appliances","Books","Others"];

    // userToPostedProducts mapping
    mapping (address=>Product[]) public userToProductsMap;
    uint256 public userProductsCount = 0;

    // userToBoughtProducts mapping
    mapping (address=>Product[]) public userBoughtProducts;
    uint256 public boughtProductsCount = 0;

    //Products Array
    Product[] public AllProducts;

    uint256 public nextProductId = 0;

    modifier checkSeller(uint256 productId){
        require(msg.sender == AllProducts[productId].seller,"You are not the seller of this product");
        _;
    }
    modifier checkBalance(uint256 productId){
        require(msg.value == AllProducts[productId].price * 1 gwei,"Incorrect amount");
        _;
    }

    // postProduct
    function postProduct(string memory _name,string memory _description,uint256 _price,string memory _category,string memory _imageURL) public {
        Product memory product = Product({
            id:nextProductId,
            name:_name,
            description:_description,
            price:_price,
            category:_category,
            imageURL:_imageURL,
            seller:payable(msg.sender),
            buyer: address(0),
            sold:false
        });
        userToProductsMap[msg.sender].push(product);
        userProductsCount++;
        AllProducts.push(product);
        nextProductId++;
    }

    // buyProduct
    function buyProduct(uint256 productId) public payable checkBalance(productId){
        require(AllProducts[productId].sold == false,"This item  has already been sold");

        AllProducts[productId].seller.transfer(msg.value);

        AllProducts[productId].buyer = msg.sender;
        AllProducts[productId].sold = true;
        userBoughtProducts[msg.sender].push(AllProducts[productId]);
        boughtProductsCount++;
    }

    // deleteProduct
    function deleteProduct(uint256 productId) public {
        delete AllProducts[productId];
    }

    // edit Product
    function editProduct(uint256 productId,string memory _name,string memory _description,uint256 _price,string memory _category,string memory _imageURL) public checkSeller(productId) {
        require(AllProducts[productId].sold == false,"This item  has already been sold");
        Product storage product = AllProducts[productId];
        product.name = _name;
        product.description = _description;
        product.price = _price;
        product.category = _category;
        product.imageURL = _imageURL;
    }
    // createCategory
    // function createCategory(string memory category) public {
    //     require(bytes(categories[0]).length == 0,"Cannot create empty category");
    //     categories.push(category);
    // }
}