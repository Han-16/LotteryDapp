const ResponseHandler = require("../services/ResponseHandler");

class WalletController {
      
    static async createWallet(req, res) {
        const funcName = "createWallet";
        try {
            const accountName = req.body.account_name;
            const account = req.body.account;
            const privateKey = req.body.private_key;
            console.log(`${funcName} req.body : ${JSON.stringify(req.body)}`);
        } catch (error) {
            console.error(`[${funcName}] err : `, error);
            return ResponseHandler.sendServerError(req, res, error);
        }
    }
}

module.exports = WalletcController;