var Campground = require("../models/campground")
var Comment = require("../models/comment")

var middlewareObj = {}

middlewareObj.checkCommentOwnership = function(){
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, comment){
			if (err) {
					res.redirect("back")
				} else {
					if (comment.author.id.equals(req.user._id)) {
						next()
					} else {
						res.redirect("back")
					}
				}
			})
	} else {
		res.redirect("back")
	}
} 
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, campground){
			if (err) {
				res.redirect("back")
			} else {
				if (campground.author.id.equals(req.user._id)) {
					next()
				} else {
					res.redirect("back")
				}
			}
		})
	} else {
		res.redirect("back")
	}
}

middlewareObj.isLogedIn = function(req, res, next){
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect("/login")
}

module.exports = middlewareObj