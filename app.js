var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	Campground = require("./models/campground"),
	seedDB = require("./seeds");

require("dotenv").config();
app.locals.moment = require("moment"); // biến cục bộ

//require Routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v12_1", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});
// mongoose.set('useCreateIndex', true);

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //__dirname đường dẫn từ thư mục gốc + "/public"
app.use(methodOverride("_method")); //methodOverride đã chuyển hướng yêu cầu POST của chúng tôi thành một yêu cầu PUT.
app.use(flash());

//Seed the database
// seedDB();

// PASSPORT CONFIGURATION
app.use(
	require("express-session")({
		secret: "Hello world",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user; //res.locals.bien là tạo 1 biến để có thể gọi trong file ejs, ko cần phải include trong lúc res.render ejs
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes); //thay thế path này vào các path có trong commentRoutes

app.listen(8080, function () {
	console.log("server start");
});
