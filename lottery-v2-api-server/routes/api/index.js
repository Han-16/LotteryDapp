const LotteryV2Controller = require("../../controllers/LotteryV2Controller");

const router = require("express").Router();

router.use("/wallet", require("./wallet"));
router.use("/lottery/v2", require("./lotteryV2"));

module.exports = router;