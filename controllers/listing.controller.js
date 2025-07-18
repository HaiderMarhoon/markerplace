const express = require("express")
const router = express.Router()
const Listing = require("../models/listing")
const isSignedIn = require("../middleware/is-signed-in")
const { cloudinary } = require("../congif/cloudinary")
const upload = require ("../congif/multer")



//new page
router.get("/new", isSignedIn, (req, res) => {
    res.render("listings/new.ejs")

})
// post to dB
router.post("/", isSignedIn, upload.single('image') ,async (req, res) => {
    try {
        req.body.seller = req.session.user._id
        req.body.image = {
            url: req.file.path,
            cloudinary_id: req.file.filename
        }
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
    try{
    const foundListings = await Listing.findById(req.params.listingId).populate("seller").populate("comments.author")
    console.log(foundListings)
    res.render("listings/show.ejs", { foundListings: foundListings })
    }
    catch(error){
        console.log(error)
        res.send("Sorry you cant access")
    }
})

router.delete("/:listingId",isSignedIn, async (req, res) => {
    const foundListings = await Listing.findById(req.params.listingId).populate("seller")
    if (foundListings.seller._id.equals(req.session.user._id)) {
        await foundListings.deleteOne();
        return res.redirect("/listings")
    }

    return res.send("Not authorized")
})

router.get("/:listingId/edit",isSignedIn, async (req, res) => {
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

router.put('/:listingId',isSignedIn, async (req, res) => {
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

// comment to db
router.post("/:listingId/comments", async(req,res) =>{
    const foundListings = await Listing.findById(req.params.listingId)
    req.body.author = req.session.user._id
    foundListings.comments.push(req.body)
    await foundListings.save()
    res.redirect(`/listings/${req.params.listingId}`)
})





module.exports = router