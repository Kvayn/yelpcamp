var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var passport = require("passport")
var LocalStrategy = require("passport-local")

var Campground = require("./models/campground")
var Comment = require("./models/comment")
var User = require("./models/user")
var seedDB = require("./seeds")

seedDB();

//Passport configuration
app.use(require("express-session")({
	secret: "There is no spoon",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
	res.locals.currentUser = req.user
	next()
})
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.listen(8000, function(){
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
app.get("/campgrounds/:id/comments/new", isLogedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})	
})

app.post("/campgrounds/:id/comments", isLogedIn, function(req, res){
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

//AUTH ROUTES
app.get("/register", function(req, res){
	res.render("register");
}) 

app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
	res.render("login")
})
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){

})

//Logout rout
app.get("/logout", function(req, res){
	req.logout()
	res.redirect("/campgrounds")
})

function isLogedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect("/login")
}