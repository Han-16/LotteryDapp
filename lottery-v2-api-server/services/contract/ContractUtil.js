const Web3 = require("web3");
const config = require("../../config/appConfig");
const envType = process.env.NODE_ENV || "development";
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, `../../config/${envType}.env`) });
const { FeeMarketEIP1559Transaction } = require("@ethereumjs/tx");
const {  } = require("@ethereumjs/tx");


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

    async signTransaction(signer, pk, to, gas, value, data) {
        const funcName = "signTransaction";
        try {
            const nonce = await this.web3.eth.getTransactionCount(signer);
            const priorityFee = this.web3.utils.toWei("1", "Gwei");
            const pendingBlock = await this.web3.eth.getBlock("pending");
            const baseFeePerGas = pendingBlock.baseFeePerGas;
            const toHex = this.web3.utils.toHex();
            const chainId = await this.web3.eth.net.getId();

            const rawTx = {
                nonce: toHex(nonce),
                to: to,
                maxPriorityFeePerGas: toHex(priorityFee),
                maxFeePerGas: toHex(Math.floor(baseFeePerGas * 1.01) + Number(priorityFee)),
                gas: toHex(gas),
                gasLimit: toHex(Math.floor(gas * 1.01)),
                value: toHex(value),
                data: data,
                chainId: toHex(chainId),
            };

            console.log(`[${funcName}] rawTx : ${JSON.stringify(rawTx)}`);

            FeeMarketEIP1559Transaction.fromTxData(rawTx, )
        } catch (err) {
            console.error(`[${funcName}] err : `, err);
        }
    }

}

module.exports = ContractUtil;