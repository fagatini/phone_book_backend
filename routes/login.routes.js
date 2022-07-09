const Router = require("express");
const router = new Router();
const loginController = require("../controller/login.controller");

router.post("/register", loginController.register);
router.post("/", loginController.loginUser);
router.post("/admin", loginController.loginAdmin);

module.exports = router;
