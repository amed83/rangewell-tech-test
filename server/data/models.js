const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//deal schema
const dealSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    amountRequired: Number
});

dealSchema.index({'title':'text'})


module.exports = mongoose.model('deals', dealSchema) 

// module.exports= dealSchema
// module.exports = dealsCollection