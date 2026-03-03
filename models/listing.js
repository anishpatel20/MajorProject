const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new schema({
    title:{
        type:String,
        required :true
    },

    description:String,

    image:{

        url:String,
        filename:String

        // type:String,
        // default:"https://plus.unsplash.com/premium_photo-1682377521697-bc598b52b08a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D",
        
        // set:(v)=> v===""? "https://plus.unsplash.com/premium_photo-1682377521697-bc598b52b08a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D":v,
        
    },

    price:Number,

    location:String,
     
    country:String,

    // this is the field for the map
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // location type must be pointer
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },

    // category:{
    //     type:[Number],
    //     enum:["mountains","arctic","farms","beach house"];
    // },
    
    reviews:[
        {
            type: schema.Types.ObjectId,
            ref:"Review"
        }
    ]
    ,
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    }
});


//this is the middleware for delete the listing with the present reviews
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;
