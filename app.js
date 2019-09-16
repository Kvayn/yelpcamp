var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

var Campground = require("./models/campground")
var Comment = require("./models/comment")
var seedDB = require("./seeds")

seedDB();


mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.listen(8080, function(){
	console.log("Server has started succsessfuly")

})

app.get("/", function(req, res){
	res.render("landing")
})
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if (err) {
			console.log("Failed to fetch campgrounds")
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds})
		}
	})
})
app.post("/campgrounds", function(req, res){
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var newCamp = {name: name, image: image, description: description}
	Campground.create(newCamp, function(err, newlyCreated){
		if (err) {
			console.log("Failde to add into the data base")
			console.log(err)
		} else {
			res.redirect("/campgrounds")
		}
	})
})


app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new")
})

app.get("/campgrounds/:id", function(req, res){
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
//=========================
//Comments ROUTS
//=========================
app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})	
})

app.post("/campgrounds/:id/comments", function(req, res){
	//lookup campgriund using id
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err)
			res.redirect("/campgrounds")
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err)
				} else {
					campground.comments.push(comment)
					campground.save()
					res.redirect("/campgrounds/" + campground._id)
				}
			})
		}
	})
	//create new comment
	//connect new comment to compground
	//redirect
})