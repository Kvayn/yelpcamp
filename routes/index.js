var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")
var Campground = require("../models/campground")
var Comment = require("../models/comment")


//root rout
router.get("/", function(req, res){
	res.render("landing")
})
//==============
//AUTH ROUTES
//==============

//show register form
router.get("/register", function(req, res){
	res.render("register");
}) 

//register rout
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err)
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds")
		})
	})
})
//Login form
router.get("/login", function(req, res){
	res.render("login")
})
//Login rout
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){

})

//Logout rout
router.get("/logout", function(req, res){
	req.logout()
	res.redirect("/campgrounds")
})

//currentUser middleware
function isLogedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect("/login")
}

module.exports = router