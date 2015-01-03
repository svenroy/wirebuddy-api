var express = require('express');
var router = express.Router();
var simpledb = require('mongoose-simpledb');

var db =  simpledb.init();

router.post("/post/create", function (req, res){
	var user_id = req.body.user_id,
		country_from = req.body.from, 
		country_to = req.body.to,
		max_amount = req.body.max,
		min_amount = req.body.min;

	var sub = new db.Subscription({
		country_from: country_from,
    	country_to: country_to,
    	max_amount: max_amount,
    	min_amount: min_amount
	});

	db.User.findOne({"_id" : user_id}, function (err, d){
		if(err) console.error(err);
		if(d){
			d.subscriptions.push(sub);
			d.save(function (err, d){
				res.send();
			});
		}
		else{
			//TODO: send error report
			res.send();
		}
	}); 
});

router.put("/put/modify", function (req, res){
	var user_id = req.body.user_id,
		sub_id = req.body.subscription_id,
		country_from: req.body.country_from,
	    country_to: req.body.country_to,
	    max_amount: req.body.max_amount,
	    min_amount: req.body.min_amount;

	db.User.findOne({"_id" : user_id, "subscriptions._id" : sub_id}, {"subscriptions" : 1}, function (err, d){
		if(err) console.error(err);
		if(d){
			d.subscriptions.country_from = country_from;
			d.subscriptions.country_to = country_to;
			d.subscriptions.max_amount = max_amount;
			d.subscriptions.min_amount = min_amount;

			d.save(function (err, d){
				res.send();
			});
		}
		else{
			//TODO: send error report
			res.send();
		}
	});
});

router.delete("/del/subscriptions", function (req, res){

});