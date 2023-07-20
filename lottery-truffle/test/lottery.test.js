const Lottery = artifacts.require("Lottery");
const should = require("chai").should();
const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");

contract("Lottery", (accounts) => {
    console.log(accounts);

    let lottery;

    before(async() => {
        lottery = await Lottery.deployed();
        console.log(`lottery address : ${lottery.address}`);
    });

    describe("Constructor", () => {
        it("Owner should be set to accounts[0]", async () => {
            const owner = await lottery.owner();
            assert.equal(owner, accounts[0]);
            expect(owner).to.equal(accounts[0]);
            owner.should.equal(accounts[0]);
        });
    });

    describe("Enter", () => {
        it("should revert if a player enters less than .01 ETH", async () => {
            const enterAmount = web3.utils.toWei("0.009", "ether");
            console.log(`enterAmount : ${enterAmount}`);

            await truffleAssert.reverts(lottery.enter({ from : accounts[1], value : enterAmount}));
        });


        it("Enter 5 players and check values", async () => {
            const enterAmount = web3.utils.toWei("0.01", "ether");

            // player1 enter
            await lottery.enter({ from : accounts[1], value : enterAmount});
            
            // assert
            assert.equal(await lottery.getBalance(), enterAmount);
            assert.deepEqual(await lottery.getPlayers(), [accounts[1]]);

            // expect
            expect((await lottery.getBalance()).toString()).to.equal(enterAmount);
            expect(await lottery.getPlayers()).to.deep.equal([accounts[1]]);

            // should
            ((await lottery.getBalance()).toString()).should.equal(enterAmount);
            (await lottery.getPlayers()).should.deep.equal([accounts[1]]);

            // player2 enter
            await lottery.enter({ from : accounts[2], value : enterAmount});
            assert.equal(await lottery.getBalance(), web3.utils.toBN(enterAmount).mul(web3.utils.toBN(2)).toString());
            assert.deepEqual(await lottery.getPlayers(), [accounts[1], accounts[2]]);

            // p3 enter
            await lottery.enter({ from : accounts[3], value : enterAmount});
            assert.equal(await lottery.getBalance(), web3.utils.toBN(enterAmount).mul(web3.utils.toBN(3)).toString());
            assert.deepEqual(await lottery.getPlayers(), [accounts[1], accounts[2], accounts[3]]);

             // p4 enter
             await lottery.enter({ from: accounts[4], value: enterAmount });
             assert.equal(await lottery.getBalance(), web3.utils.toBN(enterAmount).mul(web3.utils.toBN(4)).toString());
             assert.deepEqual(await lottery.getPlayers(), [accounts[1], accounts[2], accounts[3], accounts[4]]);
 
             // p5 enter
             await lottery.enter({ from: accounts[5], value: enterAmount });
             assert.equal(await lottery.getBalance(), web3.utils.toBN(enterAmount).mul(web3.utils.toBN(5)).toString());
             assert.deepEqual(await lottery.getPlayers(), [accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]]);
        });
    });

    describe("PickWinner", () => {
        it("Should revert if pickWinner is called by not owner", async () => {
            // owner: accounts[0]
            await truffleAssert.reverts(lottery.pickWinner({ from: accounts[1] }));
        });

        it("PickWinner", async () => {
            console.log(">>> before pickWinner");

            // check players' ETH balances before pickWinner
            const account1ETHBal_bef = await web3.eth.getBalance(accounts[1]);
            console.log(`account1's ETH balance: ${account1ETHBal_bef}`);
            console.log(`account1's ETH balance to ether: ${account1ETHBal_bef / 10**18}`)
            const account2ETHBal_bef = await web3.eth.getBalance(accounts[2]);
            console.log(`account2's ETH balance: ${account2ETHBal_bef}`);
            console.log(`account2's ETH balance to ether: ${account2ETHBal_bef / 10**18}`)
            const account3ETHBal_bef = await web3.eth.getBalance(accounts[3]);
            console.log(`account3's ETH balance: ${account3ETHBal_bef}`);
            console.log(`account3's ETH balance to ether: ${account3ETHBal_bef / 10**18}`)
            const account4ETHBal_bef = await web3.eth.getBalance(accounts[4]);
            console.log(`account4's ETH balance: ${account4ETHBal_bef}`);
            console.log(`account4's ETH balance to ether: ${account4ETHBal_bef / 10**18}`)
            const account5ETHBal_bef = await web3.eth.getBalance(accounts[5]);
            console.log(`account5's ETH balance: ${account5ETHBal_bef}`);
            console.log(`account5's ETH balance to ether: ${account5ETHBal_bef / 10**18}`)

            console.log();
            console.log(">>> pickWinner");
            await lottery.pickWinner();

            console.log();
            console.log(">> after pickWinner");

            const lotteryId = await lottery.lotteryId();
            console.log(`lotteryId: ${lotteryId}`);
            assert.equal(lotteryId, 1);

            const winner = await lottery.lotteryHistory(lotteryId - 1);
            console.log(`winner at lotteryId ${lotteryId-1}: ${winner}`);

            const account1ETHBal_aft = await web3.eth.getBalance(accounts[1]);
            console.log(`account1's ETH balance: ${account1ETHBal_aft}`);
            const account2ETHBal_aft = await web3.eth.getBalance(accounts[2]);
            console.log(`account2's ETH balance: ${account2ETHBal_aft}`);
            const account3ETHBal_aft = await web3.eth.getBalance(accounts[3]);
            console.log(`account3's ETH balance: ${account3ETHBal_aft}`);
            const account4ETHBal_aft = await web3.eth.getBalance(accounts[4]);
            console.log(`account4's ETH balance: ${account4ETHBal_aft}`);
            const account5ETHBal_aft = await web3.eth.getBalance(accounts[5]);
            console.log(`account5's ETH balance: ${account5ETHBal_aft}`);

            console.log(`account1 balance difference: ${web3.utils.toBN(account1ETHBal_aft).sub(web3.utils.toBN(account1ETHBal_bef))}`);
            console.log(`account2 balance difference: ${web3.utils.toBN(account2ETHBal_aft).sub(web3.utils.toBN(account2ETHBal_bef))}`);
            console.log(`account3 balance difference: ${web3.utils.toBN(account3ETHBal_aft).sub(web3.utils.toBN(account3ETHBal_bef))}`);
            console.log(`account4 balance difference: ${web3.utils.toBN(account4ETHBal_aft).sub(web3.utils.toBN(account4ETHBal_bef))}`);
            console.log(`account5 balance difference: ${web3.utils.toBN(account5ETHBal_aft).sub(web3.utils.toBN(account5ETHBal_bef))}`);
        });

        it.skip("Calculate winner - getRandomNumber", async () => {
            const lotteryId = await lottery.lotteryId();

            const winner = await lottery.lotteryHistory(lotteryId - 1);
            console.log(`winner : ${winner}`);
            console.log();
 
            const randomNum = await lottery.getRandomNumber();
            console.log(`randomNumber : ${randomNum}`);
            console.log();
            
            const blockNumber = await web3.eth.getBlockNumber();
            console.log(`block number : ${blockNumber}`);
            console.log();

            const currentBlock = await web3.eth.getBlock(blockNumber);
            console.log(`current block : ${currentBlock}`);
            console.log();

            const calculatedRandomNum = web3.utils.toBN(web3.utils.keccak256(web3.utils.encodePacked({ value : await lottery.owner(), type : "address"}, { value : currentBlock.timestamp, type : "uint256" }))).toString();
            console.log(`calculated random number : ${calculatedRandomNum}`);
            assert.equal(randomNum, calculatedRandomNum);
            console.log();

            const calculatedWinnerIndex = web3.utils.toBN(calculatedRandomNum).mod(web3.utils.toBN(5)).toString();
            console.log(`calculated winner index : ${calculatedWinnerIndex}`);
            assert.equal(winner, accounts[Number(calculatedWinnerIndex) + 1]);
        });

        it.skip("Calculate winner - getRandomNumberV2", async() => {
            const lotteryId = await lottery.lotteryId();

            const winner = await lottery.lotteryHisitory(lotteryId - 1);
            console.log(`winner : ${winner}`);

            const blockNumber = await web3.eth.getBlockNumber();
            console.log(`block number : ${blockNumber}`);

            const currentBlock = await web3.eth.getBlock(blockNumber);
            console.log(`current block : ${currentBlock}`);

            const calculateRandomNum = web3.utils.toBN(web3.utils.keccak256(web3.utils.encodePacked(
                { value : currentBlock.difficulty, type : "uint256" }, 
                { value : currentBlock.timestamp, type : "uint256" }, 
                {value: [accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]], type: "address[]" }))
                ).toString();
            
            const calculatedWinnerIndex = web3.utils.toBN(calculateRandomNum).mod(web3.utils.toBN(5)).toString();
            console.log(`calculated winner index : ${calculatedWinnerIndex}`);

            assert.equal(winner, acoounts[Number(calculatedWinnerIndex) + 1]);
        });

        it.skip("Calculate winner - getRandomNumberV3", async () => {
            const lotteryId = await lottery.lotteryId();

            const winner = await lottery.lotteryHistory(lotteryId - 1);
            console.log(`winner : ${winner}`);

            const randomNum = await lottery.getRandomNumberV3();
            console.log(`randomNumber : ${randomNum}`);

            const blockNumber = await web3.eth.getBlockNumber();
            console.log(`block number : ${blockNumber}`);

            const currentBlock = await web3.eth.getBlock(blockNumber);
            console.log(`current block : ${currentBlock}`);

            const calculatedRandomNum = web3.utils.toBN(web3.utils.keccak256(web3.utils.encodePacked({value: currentBlock.parentHash, type: "bytes32"}, {value: currentBlock.timestamp, type: "uint256"}))).toString();
            console.log(`calculated random number: ${calculatedRandomNum}`);
            assert.equal(randomNum, calculatedRandomNum);

            const calculatedWinnerIndex = web3.utils.toBN(calculatedRandomNum).mod(web3.utils.toBN(5)).toString();
            console.log(`calculated winner index: ${calculatedWinnerIndex}`);

            assert.equal(winner, accounts[Number(calculatedWinnerIndex) + 1]);
        });
    });
});
