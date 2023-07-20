const hre = require("hardhat");

async function main() {
    const CommitRevealLottery = await hre.ethers.deployContract("CommitRevealLottery");
    await CommitRevealLottery.waitForDeployment();

    console.log(`Lottery deployed to : ${await lottery.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });