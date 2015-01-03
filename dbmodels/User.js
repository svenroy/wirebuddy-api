
var simpledb = require('mongoose-simpledb');
var Types = simpledb.db.connection.base.modelSchemas;

exports.schema = 
{
	credentials : {
		email: String,
    	password: String,
	},

	authentication : {
    	email: Boolean,
    	phone_number: Boolean,
    	address: Boolean
    },

    messages : [Types.Message],
    accounts: [Types.Account],
    subscriptions: [Types.Subscription] 
};

exports.methods = 
{
 	GetUnreadMessagesCount: function(){
 		this.model('User').find({"messages.IsRead" : false, "_id" : this._id}, {"messages" : 1}, function (err, d){
 			if(err) console.error(err);

 			return d.length;
 		});
 	}
};