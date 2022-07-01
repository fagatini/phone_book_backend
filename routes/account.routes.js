const Router = require("express");
const router = new Router();
const accountController = require("../controller/account.controller");

router.post("/register", accountController.register);
router.post("/", accountController.loginUser);
router.post("/admin", accountController.loginAdmin);

router.get("/account/:id", accountController.getOneAccount);
router.get("/account", accountController.getAllAccounts);
router.put("/account/:id", accountController.editAccount);
// router.put("/account/:id", accountController.deleteAccount);

router.post("/account/:id", accountController.addNumber);
router.delete("/account/:id", accountController.deleteNumber);

router.put("/account/access/:id", accountController.updateAccess);
router.get("/account/access/:id", accountController.getAllAccess);

module.exports = router;
