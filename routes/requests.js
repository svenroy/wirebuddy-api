var express = require('express');
var router = express.Router();
var simpledb = require('mongoose-simpledb');

var db =  simpledb.init();

router.post("/post/request", function (req, res){

	var user_id = req.body.user_id,
		rate = req.body.rate,
		withdraw_on_rate_change = req.body.withdraw_on_rate_change,
		country_from = req.body.country_from,
		country_to = req.body.country_to,
		amount_from = req.body.amount_from,
		amount_to = req.body.amount_to,
		account_name = req.body.amount_to,
		bank = req.body.bank,
		account_number = req.body.account_number,
		sort_code = req.body.sort_code,
		country = req.body.country;

	db.User.findOne({"_id" : user_id}, {"_id" : 1}, function (err, d){
		if(err) console.error(err);
		if(d === null) res.send();

		var trans = new db.Transaction({
			handled_by: null,
			accept_date: null,
			progress: {
				creator_in: false,
		        creator_out: false,
		        handler_in: false,
		        handler_out: false
			}
		});

		var request = new db.Request({
			creator: d._id,
			date: Date.now(),

			properties: {
				withdraw_on_rate_change: withdraw_on_rate_change,
				rate_change: {
					rate_max: 0,
					rate_min: 0
				}
			},

			status: {
				withdrawn: false
			},

			transfer: {
				rate: rate,
		        from: {
		            country: country_from,
		            amount: amount_from
		        },
		        to: {
		            country: country_to,
		            amount: amount_to
		        }
			},

			account_payable: {
				account_name: account_name,
				bank: bank,
				account_number: account_number,
				sort_code: sort_code,
				country: country
			},

			transaction: trans
		});

		request.save(function (err, d){
			res.send("id": d._id);
		});
	});
});

router.get("/get/search", function (req, res){
	var country_from = req.query.from, 
		country_to = req.query.to, 
		user_id = req.query.user_id;

	db.Request.where({"transfer.from.country" : country_from, "transfer.to.country" : country_to})
		.where('transaction.inProgress', false)
		.where('status.withdrawn', false)
		.where("creator").ne(user_id)
		.select("_id transfer")
		.exec(function (err, d){
			if(err) console.error(err);
			if(d){
				res.send(d);
			}
			else{
				//TODO: send error response
				res.send();
			}
		});
});

router.put("/put/accept", function (req, res){
	var user_id = req.body.user_id,
		request_ids = req.body.request_ids;

	db.Request.where("_id").in(request_ids).where("creator").ne(user_id).exec(function (err, d){
		if(err) console.error(err);

		for(var i = 0; i < d.length; i++){
			if(d[i]){

				var transaction = new db.Transaction({
					handled_by : user_id,
					progress : {
						creator_in: false,
				        creator_out: false,
				        handler_in: false,
				        handler_out: false
					},
					accept_date: Date.now()
				});

				d[i].transaction = transaction;
			}
		}

		db.collection.save(d, function (err, d){
			res.send();
		});
	});
});

router.put("/put/modifytransfer", function (req, res){
	var request_id = req.body.req_id,
		user_id = req.body.user_id,
		country_from = req.body.country_from,
		country_to = req.body.country_to,
		amount_from = req.body.amount_from,
		amount_to = req.body.amount_to,
		rate = req.body.rate;

	db.Request.findOne({"_id" : request_id, "creator" : user_id, "transaction.inProgress" : false}, function (err, d){
		if(err) console.error(err);
		if(d){
			d.transfer.rate = rate;
			d.transfer.from.country = country_from;
			d.transfer.from.amount = amount_from;
			d.transfer.to.country = country_to;
			d.transfer.to.amount = amount_to;

			d.save(function (err, d){
				res.send();
			});
		}
		else{
			//TODO: send error response
			res.send();
		}
	});
});

router.put("/put/modifyaccountpayable", function (req, res){
	var request_id = req.body.req_id,
		user_id = req.body.user_id,
		account_name = req.body.amount_to,
		bank = req.body.bank,
		account_number = req.body.account_number,
		sort_code = req.body.sort_code,
		country = req.body.country;

	db.Request.findOne({"_id" : request_id, "creator" : user_id, "transaction.inProgress" : false}, function (err, d){
		if(err) console.error(err);
		if(d){
			d.account_payable.account_name = account_name;
			d.account_payable.bank = bank;
			d.account_payable.account_number = account_number;
			d.account_payable.sort_code = sort_code;
			d.account_payable.country = country;

			d.save(function (err, d){
				res.send();
			});
		}
		else{
			//TODO: send error response
			res.send();
		}
	});	
});

module.exports = router;