const { Wallet, verifyMessage, keccak256 } = require("ethers");
const { rlp } = require("ethereumjs-util");

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

async function signTranscation(privateKey, transaction) {
  const params = [
    transaction.nonce,
    transaction.gasPrice,
    transaction.gasLimit,
    transaction.recieverAddress,
    transaction.value,
    transaction.data,
  ];

  // Raw transaction as Buffer
  const rawTransaction = rlp.encode(params);

  const wallet = new Wallet(privateKey);
  const signature = await wallet.signMessage(rawTransaction);
  return signature;
}

function verifyTransaction(transaction, signature, address) {
  const params = [
    transaction.nonce,
    transaction.gasPrice,
    transaction.gasLimit,
    transaction.recieverAddress,
    transaction.value,
    transaction.data,
  ];

  // Raw transaction as Buffer
  const rawTransaction = rlp.encode(params);
  const signerAddress = verifyMessage(rawTransaction, signature);
  return signerAddress.toLowerCase() == address.toLowerCase();
}

const transaction = {
  nonce: "1",
  gasPrice: "0x4a817c800", // 20000000000 in decimal (20 Gwei)
  gasLimit: "0x5208", // 21000 in decimal
  reciverAddress: "0x98560fd221264e562a756582849eba2307ce1e83",
  value: "0x9184e72a000", // 10000000000000 in decimal (0.01 ETH)
  data: "0x",
};

const { privateKey, address } = generateEthereumAddress();
let sign;
signTranscation(privateKey, transaction)
  .then((signature) => {
    console.log(`Signature: ${signature}`);
    sign = signature;
  })
  .then(() => {
    const verifySign = sign;
    console.log(verifyTransaction(transaction, verifySign, address));
  });
