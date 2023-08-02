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

}

module.exports = LotteryV2Interactor;