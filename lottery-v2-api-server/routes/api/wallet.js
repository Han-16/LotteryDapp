const router = require("express").Router();
const WalletController = require("../../controllers/WalletController");

router.post("", WalletController.createWallet); 

module.exports = router;