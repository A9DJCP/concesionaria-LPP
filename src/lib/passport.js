import passport from "passport";

import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;

import database from "../database.js";
const pool = database;

import Helpers from "./helpers.js";
const helpers = Helpers.matchPassword;

passport.use(
	"local.signin",
	new LocalStrategy(
		{
			usernameField: "username",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, username, password, done) => {
			const user = await pool.query(
				"SELECT username FROM Usuario WHERE username = ?",
				[username]
			);
			const psw = await pool.query(
				"SELECT password FROM Usuario WHERE username = ?",
				[username]
			);
			if (user != "") {
				if (user[0].username == username && psw[0].password == password) {
					done(null, user, req.flash("success", "Welcome " + user.username));
				} else {
					done(null, false, req.flash("message", "Incorrect Password"));
				}
			} else {
				return done(
					null,
					false,
					req.flash("message", "The Username does not exists.")
				);
			}
		}
	)
);

passport.serializeUser(async (user, done) => {
	const id = await pool.query(
		"SELECT codUsuario FROM Usuario WHERE username = ?",
		[user[0].username]
	);
	done(null, id[0].codUsuario);
});

passport.deserializeUser(async (id, done) => {
	const rows = await pool.query("SELECT * FROM Usuario WHERE codUsuario = ?", [
		id,
	]);
	done(null, rows[0]);
});

export default passport;
