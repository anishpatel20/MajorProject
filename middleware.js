const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");//for schema validator



module.exports.validatelisting = (req,res,next)=>{
    // using the joi schema validation  we can check the data
     let {error} = listingSchema.validate(req.body,{
        abortEarly: false,
        convert: true // this can convert the string into numbers

     });  // check the validation the find the error if come 

    // console.log(error);1

    if(error){  // if error come due to missing values , error come form the joi side
        let errMsg = error.details.map((el)=>el.message).join(",");  
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }

}




//this is the function for the review schema validations
module.exports.validateReview = (req,res,next)=>{
     let {error} = reviewSchema.validate(req.body);  

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");  
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }

}



module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged!");
        return res.redirect("/login");  // we return because in the one api , we can't send more than one response , when i do return then we can exist form this api
    }

    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



// for the check the listing is deleted or updated by the owner
module.exports.onOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.CurrUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



// for only owner can delete the review
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.CurrUser._id)){
        req.flash("error","You did not created this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}