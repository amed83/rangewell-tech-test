const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//deal schema
const dealSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    title: String,
    amountRequired: Number,
    createdAt: Date,
});

// dealSchema.index({'title':'text'})


module.exports = mongoose.model('deals', dealSchema) 

