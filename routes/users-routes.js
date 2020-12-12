const express = require("express");
const usersControllers = require("../controllers/users-controllers");
const { check } = require("express-validator");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isStrongPassword(),
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isStrongPassword(),
  ],
  usersControllers.login
);

module.exports = router;
