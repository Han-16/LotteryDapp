const Migrations = artifacts.require("Lottery");

module.exports = (deployer) => {
    deployer.deploy(Migrations);
} 