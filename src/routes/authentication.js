import express from "express";
const router = express.Router();

import passport from "passport";
import { isLoggedIn } from "../lib/auth.js";

router.post("/logIn", (req, res, next) => {
	if (req.username == "" || req.password == "") {
		req.flash("Username and Password are Required");
	}
	passport.authenticate("local.signin", {
		successRedirect: "/menu",
		failureRedirect: "/logIn",
		failureFlash: true,
	})(req, res, next);
});

router.get("/logout", (req, res) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

router.get("/profile", isLoggedIn, (req, res) => {
	res.render("profile");
});

export default router;
