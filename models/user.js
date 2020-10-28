var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    usernames: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose); // bổ sung 1 số phương pháp. nếu không có sẽ tự viết phương thức để xác thực

module.exports = mongoose.model('User', UserSchema);