const listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}


module.exports.rendernewForm = (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.createListing = async (req, res) => {
    //now, we can store the url link of image from the cloud
    let url = req.file.path;
    let filename = req.file.filename;

    //  in the new.ejs at place name we crete the object : key[value] when req.body.listing then { title: , loction:..} will come , by using the object the code is small
    const newlisting = new listing(req.body.listing); // add the single data in the db 
    // console.log(req.user);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    await newlisting.save();
    req.flash("success", "New Listings Created");
    res.redirect("/listings");

}


module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!list) {
        req.flash("error", "Lisiting you requested does not exist!");
        res.redirect("/listings");
    }
    else {
        // console.log(list);
        res.render("listings/show.ejs", { list });
    }
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
        req.flash("error", "Lisiting you requested does not exist!");
        res.redirect("/listings");
    }
    else {
        let originalImageUrl = list.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250"); // use for the decrease the quality of the image , we use more featrues like blur etc..
        res.render("listings/edit.ejs", { list ,originalImageUrl});
    }
}


module.exports.UpdateListings = async (req, res) => {
    let { id } = req.params;

    //update the map location of the listing
    if (req.body.listing.geometry && req.body.listing.geometry.coordinates) {
        req.body.listing.geometry.coordinates =
            req.body.listing.geometry.coordinates.map(Number);
    }

    let list = await listing.findByIdAndUpdate(id, { ...req.body.listing }); // we need to do deconstruct the body , we can convert into the individual value

    console.log(req.file);
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = { url, filename };
        await list.save()
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`); // redirect at show page 
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    let deletedlisting = await listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Deleted Listings successfully");
    res.redirect("/listings");
}