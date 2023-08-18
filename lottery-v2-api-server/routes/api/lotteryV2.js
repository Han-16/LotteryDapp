const router = require("express").Router();

const LotteryV2Controller = require("../../controllers/LotteryV2Controller");

router.post("/enter", LotteryV2Controller.enter);

router.get("/balance", LotteryV2Controller.getBalance);
router.get("/players", LotteryV2Controller.getPlayers);
router.get("/id", LotteryV2Controller.lotteryId);


module.exports = router;