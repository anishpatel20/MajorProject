const Review = require("../models/review.js");
const listing = require("../models/listing.js");



module.exports.createReview = async(req,res)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();
    req.flash("success","New Review Created");
   res.redirect(`/listings/${list._id}`);
}


module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted successfully");
    res.redirect(`/listings/${id}`); 
}