const errorCodes = require("../../constants/errorCodes").errorCodes;
const { Wallet } = require("../../models")
const _ = require("lodash");

class WalletDBInteractor {

    static async insertWallet(walletInfo) {
        const funcName = "insertWallet";
        try {
            const sameWallet = await Wallet.findOne({
                where: {
                    account_name: walletInfo.account_name,
                },
            });
            console.log(`[${funcName}] same wallet: ${JSON.stringify(sameWallet)}`);

            if (_.isEmpty(sameWallet)) {
                const created = await Wallet.create(walletInfo);
                if (!_.isEmpty(created)) {
                    return {
                        status: errorCodes.success,
                        err: null,
                    };
                } else {
                    throw new Error(`account ${walletInfo.account} is not inserted well`)
                }
            }
            return {
                status: errorCodes.client_issue,
                err: null,
            };
        } catch (err) {
            console.error(`[${funcName}] err : `, err);
            return {
                status: errorCodes.server_issue,
                err: err,
            };
        }
    }


    static async getWallet(accountName) {
        const funcName = "getWallet";
        try {
            const wallet = await Wallet.findOne({
                where: {
                    account_name: accountName,
                },
            });
            if (!_.isEmpty(wallet)) {
                return {
                    status: errorCodes.success,
                    result: wallet,
                    err: null,
                };
            }
            return {
                status: errorCodes.client_issue,
                result: null,
                err: null,
            };
        } catch (err) {
            console.err(`[${funcName} err : ] ${err}`);
            return {
                status: errorCodes.server_issue,
                result: null,
                err: err,
            }
        }
    }

}

module.exports = WalletDBInteractor;