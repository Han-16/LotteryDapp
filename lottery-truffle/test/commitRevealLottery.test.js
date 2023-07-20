let truffleAssert = require("truffle-assertions");

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

            console.log(`commitCloses : ${commitCloses}, revealCloses : ${revealCloses}, duration : ${duration}`);

            const currentBlockNum = await web3.eth.getBlockNumber();
            console.log(`current block number : ${currentBlockNum}`);

            assert.equal(commitCloses.toString(), web3.utils.toBN(currentBlockNum).add(duration).toString(), 
            "commitCloses should be block.number + DURATION");
            
            assert.equal(revealCloses.toString(), commitCloses.add(duration));
        });
    });

    describe("Enter", () => {
        it("Should revert if a player enters less than 0.01 ether", async () => {
            const enterAmount = web3.utils.toWei("0.001", "ether");

            const secret = 12345;
            const commit = web3.utils.keccak256(web3.utils.encodePacked({ value: accounts[1], type: "address" }, { value: secret, type: "uint256" }));
            console.log(`commit: ${commit}`);

            await truffleAssert.reverts(commitRevealLottery.enter(commit, { from: accounts[1], value: enterAmount }), "msg.value should be greater than or equal to 0.01 ether");
        });

        it("Enter 3 players and check values", async () => {
            const enterAmount = web3.utils.toWei("0.01", "ether");

            // player1 enter
            const secret1 = 12345;
            const commit1 = web3.utils.keccak256(web3.utils.encodePacked({ value: accounts[1], type: "address" }, { value: secret1, type: "uint256" }));
            console.log(`commit1: ${commit1}`);

            await commitRevealLottery.enter(commit1, { from: accounts[1], value: enterAmount });

            // check values
            assert.equal(await commitRevealLottery.getBalance(), enterAmount, "0.01 ETH not sent correctly by account1");
            assert.equal(await commitRevealLottery.commitments(accounts[1]), commit1);

            // player2 enter
            const secret2 = 12346;
            const commit2 = web3.utils.keccak256(web3.utils.encodePacked({ value: accounts[2], type: "address" }, { value: secret2, type: "uint256" }));
            console.log(`commit2: ${commit2}`);

            await commitRevealLottery.enter(commit2, { from: accounts[2], value: enterAmount });
            assert.equal(await commitRevealLottery.getBalance(), web3.utils.toBN(enterAmount).mul(web3.utils.toBN(2)).toString());
            assert.equal(await commitRevealLottery.commitments(accounts[2]), commit2);

            // player3 enter
            const secret3 = 12347;
            const commit3 = web3.utils.keccak256(web3.utils.encodePacked({ value: accounts[3], type: "address" }, { value: secret3, type: "uint256" }));
            console.log(`commit3: ${commit3}`);

            await commitRevealLottery.enter(commit3, { from: accounts[3], value: enterAmount });
            assert.equal(await commitRevealLottery.getBalance(), web3.utils.toBN(enterAmount).mul(web3.utils.toBN(3)).toString());
            assert.equal(await commitRevealLottery.commitments(accounts[3]), commit3);

            // player4 enter should revert
            const secret4 = 12348;
            const commit4 = web3.utils.keccak256(web3.utils.encodePacked({ value: accounts[4], type: "address" }, { value: secret4, type: "uint256" }));
            console.log(`commit4: ${commit4}`);

            await truffleAssert.reverts(commitRevealLottery.enter(commit4, { from: accounts[4], value: enterAmount }), "commit duration is over");
            // await commitRevealLottery.enter(commit4, { from: accounts[4], value: enterAmt });
        });
    });
});