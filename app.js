var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.listen(8080, function(){
	console.log("Server has started succsessfuly")

})

//schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
})

var Campground = mongoose.model("Campground", campgroundSchema)

app.get("/", function(req, res){
	res.render("landing")
})
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if (err) {
			console.log("Failed to fetch campgrounds")
			console.log(err)
		} else {
			res.render("index", {campgrounds: campgrounds})
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
	res.render("new")
})

app.get("/campgrounds/:id", function(req, res){
	var id = req.params.id
	Campground.findById(id, function(err, campground){
		if (err) {
			console.log("Faild to fetch campground with id: " + id)
			console.log(err)
		} else {
			res.render("show", {campground: campground})
		}	
	})
})