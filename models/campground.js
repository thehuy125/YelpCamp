var mongoose = require("mongoose");
const Comment = require("./comment");

// SCHEMA setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	geometry: {
		type: {
			type: String, // Don't do `{ location: { type: String } }`
			enum: ["Point"], // 'location.type' must be 'Point'
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	location: String,
	price: String,
	description: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		username: String,
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

//Delete Comment
campgroundSchema.pre("remove", async function () {
	await Comment.remove({
		_id: {
			$in: this.comments,
		},
	});
});

module.exports = mongoose.model("Campground", campgroundSchema);
