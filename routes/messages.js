var express = require('express');
var router = express.Router();
var simpledb = require('mongoose-simpledb');

var db =  simpledb.init();

router.get("/get/all/:user_id", function (req, res){

	var user_id = req.param.user_id;
	db.User.findOne({"_id" : user_id}, {"messages" : 1}, function (err, d){
		if(err) console.error(err);
		if(d === null) res.send();

		res.send(d.messages);
	});
});

router.put("/put/markasread", function (req, res){
	var user_id = req.body.user_id,
		message_id = req.body.message_id;

	db.User.findOne({"_id" : user_id}, {"messages" : 1}, function (err, d){
		if(err) console.error(err);
		if(d === null) res.send();

		d.messages.id(message_id).IsRead = true;
		d.save(function (err, d){
			if(err) console.error(err);
			res.send(d);
		});
	});
});

router.delete("/del/message", function (req, res) {
	var user_id = req.body.user_id,
		message_id = req.body.message_id;

	db.User.findOne({"_id" : user_id}, {"messages" : 1}, function (err, d){
		if(err) console.error(err);
		if(d === null) res.send();
		
		d.messages.id(message_id).remove();
		d.save(function (err, d){
			if(err) console.error(err);
			res.send();
		});
	});	
});

router.delete("/del/messages", function (req, res) {
	var user_id = req.body.user_id,
		message_ids = req.body.message_ids;

	db.User.findOne({"_id" : user_id}, function (err, d){
		if(err) console.error(err);
		if(d === null) res.send();
		
		for(var i = 0; i < message_ids.length; i++){
			d.messages.id(message_ids[i]).remove();
		}
		
		d.save(function (err, d){
			if(err) console.error(err);
			res.send();
		});
	});	
});

router.post("/post/message", function (req, res){

	var user_id = req.body.user_id,
		title = req.body.title,
		content = req.body.content;

	//TODO: make sure title/content is not empty

	var message = new db.Message({
		title: title, 
    	content: content, 
    	date: Date.now(), 
    	IsRead: false
	});

	db.User.findOne({"_id": user_id }, function (err, d){
		if(err) console.error(err);
		if(d === null) res.send();

		d.messages.push(message);
		d.save(function (err, d){
			res.send();
		});
	});
});

module.exports = router;