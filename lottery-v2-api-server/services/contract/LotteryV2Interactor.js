const { ResponseError } = require("web3");
const ContractUtil = require("./ContractUtil");
const contractUtil = new ContractUtil();
const ResponseHandler = require("../ResponseHandler");


class LotteryV2Interactor {

    constructor() {
        this.#initializeContract();
    }

    async #initializeContract() {
        this.web3 = contractUtil.web3;
        this.LotteryV2 = await contractUtil.getContract("LotteryV2");
    }


    async enter(signer, pk, enterAmount) {
        const funcName = "enter";
        try {
            const gas = await this.LotteryV2.methods.enter().estimateGas({ from : signer, value : enterAmount })
            .catch(revertReason => { throw new Error(`estimating gas error: ${revertReason}`) });

            const to = this.LotteryV2._address;
            const data = this.LotteryV2.methods.enter().encodeABI();

            const serializedTx = await contractUtil.signTransaction(signer, pk, to, gas, enterAmount, data);

            let txHash;
            await this.web3.eth.sendSignedTransaction(serializedTx)
                .on("transactionHash", async (tx) => {
                    console.log(`[${funcName}] transaction created! tx hash : ${tx}`)
                    txHash = tx;
                });

                return {
                    status: true,
                    result: txHash,
                    errMsg: null,
                };
        } catch (err) {
            console.error(`[${funcName}] err : ${err}`);
            return {
                status: false,
                result: null,
                errMsg: err.message,
            };
        }
    }

    async getBalance() {
        const funcName = "getBalance";
        try {
            const balance = this.LotteryV2.methods.getBalance().call();
            console.log(`[${funcName}] balance of LotteryV2: ${balance }`);

            return {
                status: true,
                result: balance,
                errMsg: null,
            }
        } catch (err) {
            console.error(`[${funcName}] err: `, err);
            return {
                status: false,
                result: null,
                errMsg: err.message,
            }
        }
    }

    async getPlayers() {
        const funcName = "getPlayers";
        try {
            const players = await this.LotteryV2.methods.getPlayers().call();
            console.log(`[${funcName}] players: ${JSON.stringify(players)}`);

            return {
                status: true,
                result: players,
                errMsg: null,
            }
        } catch (err) {
            console.error(`[${funcName}] err:`, err);
            return {
                status: false,
                result: null,
                errMsg: err.message,
            }
        }
    }

    async lotteryId() {
        const funcName = "lotteryId";
        try {
            const lotteryId = await this.LotteryV2.methods.lotteryId().call();
            console.log(`[${funcName}] lotteryId: ${lotteryId}`);
            
            return {
                status: true,
                result: lotteryId,
                errMsg: null,
            }
        } catch (err) {
            console.error(`[${funcName}] err:`, err);
            return {
                status: false,
                result: null,
                errMsg: err.message,
            }
        }
    }
}

module.exports = LotteryV2Interactor;  