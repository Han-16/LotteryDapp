const truffleAssert = require("truffle-assertions");
const CommitRevealLottery = artifacts.require("CommitRevealLottery");

contract("CommitRevealLottery", accounts => {
    console.log(accounts);

    let commitRevealLottery;

    before(async () => {
        commitRevealLottery = await CommitRevealLottery.deployed();
        console.log(`commitRevealLottery address : ${commitRevealLottery.address}`);
    });

    describe("Constructor", () => {
        it("commitCloses & revealCloses should be set correctly", async () => {
            const commitCloses = await commitRevealLottery.commitCloses();
            const revealCloses = await commitRevealLottery.revealCloses();
            const duration = await commitRevealLottery.DURATION();
            console.log(`commitCloses: ${commitCloses}, revealCloses: ${revealCloses}, duration: ${duration}`);

            const currentBlockNum = await web3.eth.getBlockNumber();
            console.log(`current block number: ${currentBlockNum}`);

            assert.equal(commitCloses.toString(), web3.utils.toBN(currentBlockNum).add(duration).toString());
            assert.equal(revealCloses.toString(), commitCloses.add(duration));
        });
    });

    describe("Enter", () => {
        it("should revert if a player enters less than 0.01 ether", async () => {
            const enterAmount = web3.utils.toWei("0.009", "ether");

            const secret = 12345;
            const commit = web3.utils.keccak256(web3.utils.encodePacked({ value : accounts[1], type : "address"}, { value : secret, type : "uint256"}));
            console.log(`commit : ${commit}`);

            await truffleAssert.reverts(commitRevealLottery.enter(commit, { from : accounts[1], value : enterAmount}), "msg.value should be greater than or equal to 0.01 ETH");
        });
        it("Enter 3 players and check values", async () => {
            const enterAmt = web3.utils.toWei("0.01", "ether");

            // player1 enter
            const secret1 = 12345;
            const commit1 = web3.utils.keccak256(web3.utils.encodePacked({value: accounts[1], type: "address"}, {value: secret1, type: "uint256"}));
            console.log(`commit1: ${commit1}`);

            await commitRevealLottery.enter(commit1, { from: accounts[1], value: enterAmt });
        });
    });
}); 