const crypto = require("crypto");

function sha256(message) {
  return crypto.createHash("sha256").update(message).digest("hex");
}

function nonce(message) {
  let difficulty = 3;
  let difficultyString = Array(difficulty)
    .fill(0)
    .toString()
    .split(",")
    .join("");
  let nonce = 0;
  while (
    sha256(message + nonce).substring(0, difficulty) !== difficultyString
  ) {
    nonce = nonce + 1;
  }
  return nonce;
}
console.time("Time Taken");
console.log(nonce("Alice sent Bob 5BTC"));
console.timeEnd("Time Taken");
