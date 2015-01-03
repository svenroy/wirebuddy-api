var ObjectId = require('mongoose-simpledb').Types.ObjectId;
exports.schema = 
{
    handled_by : { type: ObjectId, ref: 'User' },
    progress: 
    {
        creator_in: Boolean,
        creator_out: Boolean,
        handler_in: Boolean,
        handler_out: Boolean
    },
    accept_date: Date
};

exports.virtuals = {
    isComplete: {
        get: function () {
            return this.progress.creator_in && 
                this.progress.creator_out &&
                this.progress.handler_in &&
                this.progress.handler_out;
        }
    },
    inProgress: {
        get: function () {
            return this.progress.creator_in || 
                this.progress.creator_out ||
                this.progress.handler_in ||
                this.progress.handler_out;
        }
    } 
};