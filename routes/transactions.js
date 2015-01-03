var express = require('express');
var router = express.Router();
var simpledb = require('mongoose-simpledb');

var db =  simpledb.init();

router.get("/get/all/:user_id", function (req, res){
	var user_id = req.params.user_id;

	db.Request.find({"$or" : {"creator" : user_id, "transaction.handled_by" : user_id}, "transaction.isComplete" : false}, function (err, d){
		if(err) console.error(err);

		if(d){
			res.send(d);
		}
		else{
			//TODO: send error report
			res.send();
		}
	});
});

router.put("/put/withdraw", function (req, res){
	var user_id = req.body.user_id,
		trans_id = req.body.transaction_id;

	db.Request.findOne({"_id" : trans_id});
});