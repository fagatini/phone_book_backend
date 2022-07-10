const Router = require("express");
const router = new Router();
const accountController = require("../controller/account.controller");

router.get("/account/:id", accountController.getOneAccount);
router.get("/accounts", accountController.getAllAccounts);
router.post("/account/edit/:id", accountController.editAccount);
router.put("/account/:id", accountController.deleteAccount);

module.exports = router;
