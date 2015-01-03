var express = require('express');
var router = express.Router();
var simpledb = require('mongoose-simpledb');

var db =  simpledb.init();

router.post("/post/user", function (req, res){
	var email = req.body.email,
		password = req.body.password;

	var user = new db.User({
		credentials : {
			email: email,
			password: password
		},
		messages: [],
		accounts: [],
		subscriptions: [],
		authentication: {
			email: false,
			phone_number: false,
			address: false
		}
	});
	user.save();
	res.send();
});

router.get("/get/user/:email/:password", function (req, res){
	var email = req.param.email,
		password = req.param.password;

	db.User.findOne({'credentials.email' : email, 'credentials.password': password}, {"_id" : 1, "authentication" : 1},  function(err, user){
		if(err) console.error(err);
		if(user === null) res.send();

		res.send({"id" : user._id, "authentication" : user.authentication});
	});
});

router.put("/put/authentication", function (req, res){
	var user_id = req.body.user_id,
		email = req.body.email_authorized,
		phone = req.body.phone_authorized,
		address = req.body.address.authorized;

	db.User.findOne({"_id" : user_id}, {"authentication" : 1},  function(err, user){
		if(err) console.error(err);
		if(user === null) res.send();

		user.authentication.email = email;
		user.authentication.phone_number = phone;
		user.authentication.address = address;

		user.save(function (err, d){
			if(err) console.error(err);
			res.send({"id" : user._id, "authentication" : user.authentication});
		});
		
	}); 
});

module.exports = router;
