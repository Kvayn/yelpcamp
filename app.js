var express = require("express")
var app = express()
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.listen(8080, function(){
	console.log("Server has started succsessfuly")

})

var campgrounds = [
		{name: "Salmon Creel", image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1306&q=80"},
		{name: "Granite Hill", image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1306&q=80"},
		{name: "Camp", image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1306&q=80"}
	]

app.get("/", function(req, res){
	res.render("landing")
})
app.get("/campgrounds", function(req, res){
	
	res.render("campground",{campgrounds: campgrounds})
})
app.post("/campgrounds", function(req, res){
	var name = req.body.name
	var image = req.body.image
	var newCamp = {name: name, image: image}
	campgrounds.push(newCamp)
	res.redirect("/campgrounds")

})
app.get("/campgrounds/new", function(req, res){
	res.render("new")
})