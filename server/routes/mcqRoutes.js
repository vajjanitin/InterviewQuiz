const router = require("express").Router();
const { addMCQ, fetchMCQs } = require("../controllers/mcqController");
router.post("/add", addMCQ);
router.post("/fetch", fetchMCQs);
module.exports = router;
