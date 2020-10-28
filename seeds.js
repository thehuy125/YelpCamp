var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require("./models/comment");

var data = [{
        name: "the huy",
        image: "https://images.pexels.com/photos/4268158/pexels-photo-4268158.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established 'fact' that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using'Content here,content here ', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum ' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        name: "Kieu lan",
        image: "https://images.pexels.com/photos/4268158/pexels-photo-4268158.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using'Content here,content here ', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum ' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        name: "the huy",
        image: "https://images.pexels.com/photos/4268140/pexels-photo-4268140.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    }
];


function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('remove campgrounds!');
        //Add a few campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    //create a comment
                    Comment.create({
                        text: "this place great, but i wish there was internet",
                        author: "Homer"
                    }, function (err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(comment);
                            data.comments.push(comment);
                            data.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
    //Add a few comments
}

// function seedDB() {
//     //Remove all campgrounds
//     Campground.remove({}, function (err) {
//         if (err) {
//             console.log(err);
//         }
//         console.log("removed campgrounds!");
//         Comment.remove({}, function (err) {
//             if (err) {
//                 console.log(err);
//             }
//             console.log("removed comments!");
//             //add a few campgrounds
//             data.forEach(function (seed) {
//                 Campground.create(seed, function (err, campground) {
//                     if (err) {
//                         console.log(err)
//                     } else {
//                         console.log("added a campground");
//                         //create a comment
//                         Comment.create({
//                             text: "This place is great, but I wish there was internet",
//                             author: "Homer"
//                         }, function (err, comment) {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 campground.comments.push(comment);
//                                 campground.save();
//                                 console.log("Created new comment");
//                             }
//                         });
//                     }
//                 });
//             });
//         });
//     });
//     //add a few comments
// }

module.exports = seedDB;