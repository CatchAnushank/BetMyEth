const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
//const { interface, bytecode } = require("../compile");
const { abi, evm } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[1], gas: "1000000" });
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });
  it("allows one player to enter lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.2", "ether"),
      gas: "1000000",
    });
    const players = await lottery.methods.getPlayers().call();
    assert.equal(accounts[1], players[0]);
  });
  it("allows multiple player to enter lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.2", "ether"),
      gas: "1000000",
    });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.2", "ether"),
      gas: "1000000",
    });
    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei("0.2", "ether"),
      gas: "1000000",
    });
    const players = await lottery.methods.getPlayers().call();
    assert.equal(accounts[1], players[0]);
    assert.equal(3, players.length);
    assert.equal(accounts[0], players[1]);
    assert.equal(accounts[3], players[2]);
  });
  it("allows one player to enter lottery", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei("0.01", "ether"),
        gas: "1000000",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("Only manager can pick winner", async () => {
    try {
      await lottery.methods.pickWinner().call({ from: accounts[3] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("picking winner", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether"),
      gas: "1000000",
    });
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods
      .pickWinner()
      .send({ from: accounts[1], gas: "1000000" });
    //console.log(player);
    //console.log(accounts[1]);
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;
    const players = await lottery.methods.getPlayers().call();
    const contractBalance = await web3.eth.getBalance(lottery.options.address);
    assert(difference > web3.utils.toWei("1.8", "ether"));
    assert.equal(players.length, 0);
    assert.equal(contractBalance, 0);
    //assert.equal(accounts[1], player.to);
  });
});
