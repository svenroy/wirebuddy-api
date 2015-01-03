var ObjectId = require('mongoose-simpledb').Types.ObjectId;
var Types = simpledb.db.connection.base.modelSchemas;

exports.schema = 
{
    creator: { type: ObjectId, ref: 'User' },
    date: Date,

    properties: {
        withdraw_on_rate_change: Boolean,
        rate_change : {
            rate_max: Number,
            rate_min: Number
        }
    },

    status : {
        withdrawn: Boolean
    },

    transfer: 
    {
        rate: Number,
        from: {
            country: String,
            amount: Number
        },
        to: {
            country: String,
            amount: Number
        }
    },

    account_payable: 
    {
        account_name: String,
        bank: String,
        account_number: String,
        sort_code: String,
        country: String
    },    
    
    transaction: Types.Transaction
};