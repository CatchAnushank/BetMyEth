const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider(
  "similar vivid blade ghost foster distance replace jaguar jacket decade access regret",
  //"sick price agree liar rotate course tape account hard opera federal hero",
  "https://rinkeby.infura.io/v3/4c6da92877db4325be9faea4121f44fc"
);

const web3 = new Web3(provider);
let accounts;

const deploy = async () => {
  accounts = await web3.eth.getAccounts();
  //const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  console.log(JSON.stringify(abi));
  console.log("contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy();
