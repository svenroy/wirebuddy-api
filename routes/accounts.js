var express = require('express');
var router = express.Router();
var simpledb = require('mongoose-simpledb');

var db =  simpledb.init();

router.get("/get/all/:user_id", function (req, res){
	var user_id = req.param.user_id;

	db.User.findOne({"_id" : user_id}, {"accounts" : 1}, function (err, d){
   		if(err) console.error(err);
		if(d === null) res.send();

		res.send(d.accounts);
   	});
});

router.post("/post/account", function (req, res){
	
	var user_id = req.body.user_id,
		account_name = req.body.account_name,
        bank = req.body.bank,
        account_number = req.body.account_number,
        sort_code = req.body.sort_code,
        country = req.body.country;


   	db.User.findOne({"_id" : user_id}, {"accounts" : 1}, function (err, d){
   		if(err) console.error(err);
		if(d === null) res.send();

		var account = new db.Account({
			account_name: account_name,
        	bank: bank,
        	account_number: account_number,
        	sort_code: sort_code,
        	country: country
		});

		d.accounts.push(account);

		d.save(function (err, d){
			if(err) console.error(err);
			res.send();
		});
   	});
});

router.put("/put/account", function (req, res){
	var user_id = req.body.user_id,
		account_id = req.body.account_id,
		account_name = req.body.account_name,
        bank = req.body.bank,
        account_number = req.body.account_number,
        sort_code = req.body.sort_code,
        country = req.body.country;


   	db.User.findOne({"_id" : user_id}, {"accounts" : 1}, function (err, d){
   		if(err) console.error(err);
		if(d === null) res.send();

		d.accounts.id(account_id).account_name = account_name;
		d.accounts.id(account_id).bank = bank;
		d.accounts.id(account_id).account_number = account_number;
		d.accounts.id(account_id).sort_code = sort_code;
		d.accounts.id(account_id).country = country;

		d.save(function (err, d){
			if(err) console.error(err);
			res.send();
		});
   	});
});

router.delete("/del/account", function (req, res){
	var user_id = req.body.user_id,
		account_id = req.body.account_id;


   	db.User.findOne({"_id" : user_id}, {"accounts" : 1}, function (err, d){
   		if(err) console.error(err);
		if(d === null) res.send();

		d.accounts.id(account_id).remove();

		d.save(function (err, d){
			if(err) console.error(err);
			res.send();
		});
   	});
});

router.delete("/del/accounts", function (req, res){
	var user_id = req.body.user_id,
		account_ids = req.body.account_ids;

   	db.User.findOne({"_id" : user_id}, {"accounts" : 1}, function (err, d){
   		if(err) console.error(err);
		if(d === null) res.send();

		for(var i=0; i < account_ids.length; i++){
			d.accounts.id(account_ids[i]).remove();
		}

		d.save(function (err, d){
			if(err) console.error(err);
			res.send();
		});
   	});
});

router.get("/get/home/:country", function(req, res){
	//TODO: Not implemented
});

module.exports = router;