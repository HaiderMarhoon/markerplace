const mongoose = require("mongoose")
const Schema = mongoose.Schema

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    image: String,
    seller:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },

},{
    timestamps: true
})

module.exports = mongoose.model("Listing",listingSchema)