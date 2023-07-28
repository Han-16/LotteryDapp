const ResponseHandler = require("../services/ResponseHandler");
const CipherUtil = require("../services/CipherUtil");

class WalletController {
      
    static async createWallet(req, res) {
        const funcName = "createWallet";
        try {
            const accountName = req.body.account_name;
            const account = req.body.account;
            const privateKey = req.body.private_key;
            console.log(`${funcName} req.body : ${JSON.stringify(req.body)}`);

            const walletInfo = {
                account_name: accountName,
                account: account,
                private_key: CipherUtil.encrypt(privateKey),
            };
            console.log(`[${funcName}] wallet info: ${JSON.stringify(walletInfo)}`);
        } catch (error) {
            console.error(`[${funcName}] err : `, error);
            return ResponseHandler.sendServerError(req, res, error);
        }
    }
}

module.exports = WalletcController;