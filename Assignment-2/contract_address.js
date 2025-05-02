const { keccak256, toBuffer, bufferToHex,rlp } = require('ethereumjs-util');

/*
My flow:
- rlp.encode(concatenated bufferData )
- the result then is hashed by keccak256 cryptographic algorithm
- the last 20 bytes of result in hex formis the contract address.
 */

function generateContractAddress(senderAddress, nonce) {
    const senderAddressBytes = toBuffer(senderAddress)

    const rlpEncoded = rlp.encode([senderAddressBytes,nonce])

    const hash = keccak256(rlpEncoded)

    return bufferToHex(hash.slice(-20))
}

const senderAddress = '0x98560fd221264e562a756582849eba2307ce1e83';
const nonce = 1;

const contractAddress = generateContractAddress(senderAddress,nonce)
console.log(contractAddress)