var express = require("express"),
	middleware = require("../middleware"),
	router = express.Router({
		//phương thức Router() để tạo mới một router
		mergeParams: true, //Giữ nguyên các giá trị req.params từ bộ định tuyến mẹ.
	}),
	Campground = require("../models/campground"),
	Comment = require("../models/comment");

//================================================================
//Comment ROUTES
//================================================================

// Comment new
router.get("/new", middleware.isLoggedIn, function (req, res) {
	// find campgrounds by id
	Campground.findById(req.params.id, function (err, campground) {
		if (err || !campground) {
			req.flash("error", "No campground found");
			return res.redirect("/campgrounds");
			// console.log(err);
		} else {
			res.render("comments/new", {
				campground: campground,
			});
		}
	});
});

// comment create
router.post("/", function (req, res) {
	//lookup campground using id
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					// console.log(comment);
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
			// Comment.create({});
		}
	});
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
	//:comment_id chi lay ID
	Campground.findById(req.params.id, function (err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "No campground found");
			return res.redirect("/campgrounds");
		}
		Comment.findById(req.params.comment_id, function (err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				// console.log(req.params.comment_id);
				// console.log(req.params.id);
				// console.log(foundComment);
				res.render("comments/edit", {
					campground_id: req.params.id,
					comment: foundComment,
				});
			}
		});
	});
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
		err,
		updateComment
	) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
	//find by id and remove
	Comment.findByIdAndRemove(req.params.comment_id, function (err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", " Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
