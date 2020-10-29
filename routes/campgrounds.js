var express = require("express"),
	router = express.Router(), //phương thức Router() để tạo mới một router
	mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"), // sử dụng services là geocoding
	mapBoxToken = process.env.MAPBOX_TOKEN, // Get Token from env
	geocoder = mbxGeocoding({ accessToken: mapBoxToken }), // Set Config mapbox
	middleware = require("../middleware"),
	Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function (req, res) {
	// console.log(req.user);
	//get all campgrounds from db
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,
				page: "campgrounds",
				// currentUser: req.user
			});
		}
	});
});

// CREATE - and new campgrounds to DB
router.post("/", middleware.isLoggedIn, async function (req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var location = req.body.location;
	var geoData = await geocoder
		.forwardGeocode({
			query: req.body.location,
			limit: 1,
		})
		.send();
	var geometry = geoData.body.features[0].geometry;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	// console.log(location);

	var newCamp = {
		name: name,
		price: price,
		geometry: geometry,
		location: location,
		image: image,
		description: desc,
		author: author,
	};
	// create a new campgrounds and save to DB
	Campground.create(newCamp, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function (req, res) {
	res.render("campgrounds/new");
});

//SHOW - shows more info about  one campgrounds
router.get("/:id", function (req, res) {
	//find the campground with provided id
	Campground.findById(req.params.id)
		.populate("comments")
		.exec(function (err, foundCampground) {
			if (err || !foundCampground) {
				req.flash("error", "Campground not found");
				console.log(err);
				return res.redirect("/campgrounds");
			} else {
				//render show template with that campground
				// console.log(foundCampground);
				res.render("campgrounds/show", {
					campground: foundCampground,
				});
			}
		});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
	// is user logged in?
	Campground.findById(req.params.id, function (err, foundCampground) {
		res.render("campgrounds/edit", {
			campground: foundCampground,
		});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, async function (req, res) {
	var geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	var geometry = geoData.body.features[0].geometry;
	req.body.campground.geometry = geometry;
	// console.log(req.body.campground);

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
		err,
		updateCampground
	) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Success Updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, async function (req, res) {
	//Delete comments
	try {
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.remove();
		req.flash("success", "Success Detected");
		res.redirect("/campgrounds");
	} catch (error) {
		console.log(error.message);
		res.redirect("/campgrounds");
	}
});

module.exports = router;
