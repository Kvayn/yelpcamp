var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local")

var Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds")

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index")

//db init
//seedDB();

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


//currentUser middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user
	next()
})
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

//add routes
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)
app.use("/", indexRoutes)

app.listen(8000, function(){
	console.log("Server has started succsessfuly")

})

