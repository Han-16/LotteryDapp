const router = require("express").Router();

const LotteryV2Controller = require("../../controllers/LotteryV2Controller");

router.post("/enter", LotteryV2Controller.enter);

router.get("/balance", LotteryV2Controller.getBalance);
router.get("/players", LotteryV2Controller.getPlayers);
router.get("/id", LotteryV2Controller.lotteryId);
router.get("/history", LotteryV2Controller.lotteryHistory);
router.get("/random-number", LotteryV2Controller.getRandomWords);

module.exports = router;