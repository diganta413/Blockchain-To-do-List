const Contracts = artifacts.require("./MyContract.sol");

module.exports = function (deployer) {
  deployer.deploy(Contracts);
};