const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");

const {isLoggedIn, onOwner,validatelisting} = require("../middleware.js");

//for store the image into the cloud
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const controllersListings = require("../controllers/listing.js");


router
    .route("/")
    // Index route 
    .get(wrapAsync(controllersListings.index))
    // create the route for new post
    .post(isLoggedIn,upload.single("listing[image]"),validatelisting,wrapAsync(controllersListings.createListing));

    


    
//Create the new post get 
router.get("/new",isLoggedIn,controllersListings.rendernewForm);

// update the post
router.get("/:id/edit",isLoggedIn,onOwner, wrapAsync(controllersListings.renderEditForm));


router
    .route("/:id")
    //edit the show post 
    .put(isLoggedIn,onOwner,upload.single("listing[image]"),validatelisting,wrapAsync(controllersListings.UpdateListings))
    // show Route
    .get(wrapAsync(controllersListings.showListings))
    //Delete the listing
    .delete(isLoggedIn,onOwner,wrapAsync(controllersListings.destroyListing));




module.exports = router;