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
    catch (error) {
        console.log(error)
        res.send("Sometings wrong")
    }
})

// index page
router.get("/", async (req, res) => {
    const foundListings = await Listing.find()
    console.log(foundListings)
    res.render("listings/index.ejs", { foundListings: foundListings })
})

//show
router.get("/:listingId", async (req, res) => {
    const foundListings = await Listing.findById(req.params.listingId).populate("seller")
    console.log(foundListings)
    res.render("listings/show.ejs", { foundListings: foundListings })
})

router.delete("/:listingId", async (req, res) => {
    const foundListings = await Listing.findById(req.params.listingId).populate("seller")
    if (foundListings.seller._id.equals(req.session.user._id)) {
        await foundListings.deleteOne();
        return res.redirect("/listingsrs")
    }

    return res.send("Not authorized")
})

router.get("/:listingId/edit", async (req, res) => {
    try {
        const foundListings = await Listing.findById(req.params.listingId).populate("seller")
        if (foundListings.seller._id.equals(req.session.user._id)) {
            res.render("listings/edit.ejs", { foundListings: foundListings })
        }
    }
    catch (error) {
        console.log(error)
        return res.send("Not authorized")

    }
})

router.put('/:listingId', async (req, res) => {
        try {
        const foundListings = await Listing.findById(req.params.listingId).populate("seller")
        if (foundListings.seller._id.equals(req.session.user._id)) {
            await Listing.findByIdAndUpdate(req.params.listingId, req.body, {new: true})
            return res.redirect(`/listing/${req.params.listingId}`)
        }
    }
    catch (error) {
        console.log(error)
        return res.send("Not authorized")

    }
})






module.exports = router