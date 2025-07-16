const express = require("express")
const router = express.Router()
const Listing = require("../models/listing")
const isSignedIn = require("../middleware/is-signed-in")



//new page
router.get("/new", isSignedIn, (req, res) => {
    res.render("listings/new.ejs")

})
// post to dB
router.post("/", isSignedIn, async (req, res) => {
    try {
        req.body.seller = req.session.user._id
        await Listing.create(req.body)
        res.redirect("/listings")
    }
    catch(error){
        console.log(error)
        res.send("Sometings wrong")
    }
})

// index page
router.get("/",async (req,res) =>{
    const foundListings = await Listing.find()
    console.log(foundListings)
    res.render("listings/index.ejs",{foundListings:foundListings})
})

//show
router.get("/:ListingId" , async(req,res) =>{
    const foundListing = await Listing.findById(req.params.listingId).populate("seller")
    res.render("listings/show.ejs" , {foundListing:foundListing})
})









module.exports = router