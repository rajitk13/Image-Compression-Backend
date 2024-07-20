const express = require("express");
const { webhookHandler } = require("../controllers/webhookController");

const router = express.Router();

router.post("/webhook", webhookHandler);

module.exports = router;
