const express = require("express")
const router = express.Router()
const Listing = require("../models/listing")



//new page
router.get("/new" ,(req,res) =>{
    res.render("listings/new.ejs")

})

router.post("/", async (req,res) =>{
    await Listing.create(req.body)
    res.send("your submitted")
})









module.exports= router