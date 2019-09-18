var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")

var data = [
	{
		name: "Camp",
		image: "https://images.freeimages.com/images/large-previews/964/scout-camp-1547941.jpg",
		description: "This is our fiest campground"
	},
	{
		name: "Camp",
		image: "https://images.freeimages.com/images/large-previews/964/scout-camp-1547941.jpg",
		description: "This is our fiest campground"
	},
	{
		name: "Camp",
		image: "https://images.freeimages.com/images/large-previews/964/scout-camp-1547941.jpg",
		description: "This is our fiest campground"
	}
]
function seedDB(){
	//remove all campgrounds
	Campground.deleteMany({}, function(err){
		// if (err) {
		// 	console.log(err)
		// } else {
		// 	console.log("Removed campgrounds")
		// }

		// //add a few campgrounds
		// data.forEach(function(seed){
		// 	Campground.create(seed, function(err, campground){
		// 		if (err) {
		// 			console.log(err)
		// 		} else {
		// 			console.log("Data is pushed to db")
		// 			//create comment
		// 			Comment.create(
		// 				{
		// 				text: "This place sucks!",
		// 				author: "Homer"
		// 				}, function(err, comment){
		// 					if (err) {
		// 						console.log(err)
		// 					} else {
		// 						campground.comments.push(comment)
		// 						campground.save()
		// 						console.log("Created a comment")
		// 					}
		// 				})
		// 		}
		// 	})
		// })
	})
}

module.exports = seedDB