const Router = require("express");
const router = new Router();
const accessController = require("../controller/access.controller");

router.put("/account/access", accessController.updateAccess);
router.get("/account/access/:id", accessController.getAllAccess);
router.post("/account/access/:id", accessController.getOneAccess);
router.post("/accounts/access/:id", accessController.createAccess);

router.get("/admin/accesses", accessController.getAllAccessAdmin);

module.exports = router;
