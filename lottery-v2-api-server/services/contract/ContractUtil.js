const Web3 = require("web3");
const config = require("../../config/appConfig");
const envType = process.env.NODE_ENV || "development";
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, `../../config/${envType}.env`) });
class ContractUtil {
    
    constructor() {
        this.#initializeWeb3();
    }

    async #initializeWeb3() {
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain[envType]));
    }

    async getContract(contractName) {
        const funcName = "getContract";
        try {
            if (!(await this.web3.eth.net.isListening())) {
                this.#initializeWeb3();
            }

            const abi = this.#getContractAbi(contractName);
            const ca = process.env[contractName];
            const contract = new this.web3.eth.Contract(abi, ca);
            return contract;

        } catch (err) {
            console.error(`[${funcName}] err : ${err}`);
        }
    }

    #getContractAbi(contractName) {
        const funcName = "getContractAbi";
        try {
            const dir = path.resolve(__dirname, "../../contractAbis");
            const json = fs.readFileSync(`${dir}/${contractName}.json`);
            const instance = JSON.parse(json);
            return instance.abi;
        } catch (err) {
            console.err(`[${funcName}] err : ${err}`);
        }
    }

}

module.exports = ContractUtil;