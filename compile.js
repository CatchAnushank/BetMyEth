const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lottery = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lottery, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

//console.log(solc.compile(JSON.stringify(input)));
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Lottery.sol"
].Lottery;
