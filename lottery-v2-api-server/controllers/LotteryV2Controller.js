const ResponseHandler = require("../services/ResponseHandler");
const WalletDBInteractor = require("../services/db/WalletDBInteractor");
const errorCodes = require("../constants/errorCodes").errorCodes;
const LotteryV2Interactor = require("../services/contract/LotteryV2Interactor");
const lotteryV2Interactor = new LotteryV2Interactor();
const CipherUtil = require("../services/CipherUtil");


class LotteryV2Controller {

    static async enter(req, res) {
        const funcName = "enter";
        try {
            const accountName = req.body.account_name;
            const enterAmount = req.body.enter_amount;
            console.log(`[${funcName}] req.body : ${JSON.stringify(req.body)}`);

            const wallet = await WalletDBInteractor.getWallet(accountName);
            console.log(`[${funcName}] wallet : ${JSON.stringify(wallet)}`);
            
            switch (wallet.status) {
                case errorCodes.client_issue:
                    return ResponseHandler.sendClientError(400, req, res, "this account doesn't exist in DB");
                
                case errorCodes.server_issue:
                    throw new Error(wallet.err);
            }   

            const enterResult = await lotteryV2Interactor.enter(wallet.result.account, CipherUtil.decrypt(wallet.result.private_key), enterAmount);
            if (!enterResult.status) {
                throw new Error(enterResult.errMsg);
            }
            return ResponseHandler.sendSuccess(res, "succes", 200)({
                status: "Confirmed",
                tx_hash: enterResult.result,
            });
        } catch (err) {
            console.error(`[${funcName}] err : `, err);
            return ResponseHandler.sendServerError(req, res, err);
        }
    }
}

module.exports = LotteryV2Controller;