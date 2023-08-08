const ContractUtil = require("./ContractUtil");
const contractUtil = new ContractUtil();

class LotteryV2Interactor {

    constructor() {
        this.#initializeContract();
    }

    async #initializeContract() {
        this.web3 = contractUtil.web3;
        this.LotteryV2 = await contractUtil.getContract("LotteryV2");
    }


    async enter(signer, enterAmount) {
        const funcName = "enter";
        try {
            const gas = await this.LotteryV2.methods.enter().estimateGas({ from : signer, value : enterAmount })
            .catch(revertReason => { throw new Error(`estimating gas error: ${revertReason}`) });

            
        } catch (err) {
            console.error(`[${funcName}] err : ${err}`);
            return {
                status: false,
                result: null,
                errMsg: err.message,
            };
        }
    }
}

module.exports = LotteryV2Interactor;