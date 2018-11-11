var User = require('./models/User').User;

var user = new User({
    username: "Test5",
    password: "1234"
});

user.save(function(err, user, affected) {
    if (err) throw err;

    User.findOne({username: "Test5"}, function(err, obj) {
        console.log(obj);
    });
});