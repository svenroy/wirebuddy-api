var express = require('express');
var router = express.Router();

router.get("/get/rate/:from/:to", function (req, res){
	//TODO access daily rate
	res.send("280");
});