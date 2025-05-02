const {
  bufferToHex,
  privateToPublic,
  privateToAddress,
} = require("ethereumjs-util");
const crypto = require("crypto");

function generateEthereumAddress() {
  const privateKey = crypto.randomBytes(32);
  const publicKey = privateToPublic(privateKey);
  const address = privateToAddress(privateKey);

  return {
    privateKey: bufferToHex(privateKey),
    publicKey: bufferToHex(publicKey),
    address: bufferToHex(address),
  };
}

const { address } = generateEthereumAddress();
console.log(address);
