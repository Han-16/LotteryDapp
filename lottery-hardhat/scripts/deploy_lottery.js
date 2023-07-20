const hre = require("hardhat");

async function main() {
    const lottery = await hre.ethers.deployContract("Lottery");
    await lottery.waitForDeployment();

    console.log(`Lottery deployed to : ${await lottery.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });