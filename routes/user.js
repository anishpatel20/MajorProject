const express = require("express");
const router = express.Router({});
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const controllersUser = require("../controllers/user.js");

router
  .route("/signup")
  .get( controllersUser.renderSignUpForm)
  .post( controllersUser.signUp);



router
  .route("/login")
  //render the login form
  .get(controllersUser.renderLoginForm)
  //login
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controllersUser.login
  )


 //logout
router.get("/logout",controllersUser.logout);


module.exports = router;