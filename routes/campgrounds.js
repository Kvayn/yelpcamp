var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")

var middleware = require("../middleware")

//index rout
router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if (err) {
			console.log("Failed to fetch campgrounds")
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds})
		}
	})
})

//create rout
router.post("/", middleware.isLogedIn, function(req, res){
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name: name, image: image, description: description, author: author}
	Campground.create(newCamp, function(err, newlyCreated){
		if (err) {
			console.log("Failde to add into the data base")
			console.log(err)
		} else {
			res.redirect("/campgrounds")
		}
	})
})

//new rout
router.get("/new", middleware.isLogedIn, function(req, res){
	res.render("campgrounds/new")
})
//show rout
router.get("/:id", function(req, res){
	var id = req.params.id
	Campground.findById(id).populate("comments").exec(function(err, campground){
		if (err) {
			console.log("Faild to fetch campground with id: " + id)
			console.log(err)
		} else {
			//rendr show template
			res.render("campgrounds/show", {campground: campground})
		}	
	})
})

//edit rout
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		res.render("campgrounds/edit", {campground: campground})	
	})
})

//update rout
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
		if (err) {
			console.log(err)
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})
//destroy rout
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			console.log(err)
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds")
		}
	})
})
module.exports = router