if(process.env.NODE_ENV !=" production"){
    require('dotenv').config() 
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");//schema validator
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");


const listing_router= require("./routes/listing.js")
const review_router= require("./routes/review.js")
const user_router= require("./routes/user.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dburl = process.env.ATLASDB_URL; // Mongoatlas connection link


const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchafter:24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

//this the session 
const sessionOption = {
    store,
   secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


// app.get("/",(req,res)=>{
//     res.send("hello, I am root");
// });




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
})


// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";



main()
    .then(()=>{
        console.log("Database connection successful");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
  } 


app.get("/demouser",async(req,res)=>{
    let fakeuser = new User({
        email:"student@gmail.com",
        username:"student"
    });

    let registerUser = await User.register(fakeuser,"helloworld");
    res.send(registerUser);
}); 
 
  

//This is the listing middleware, that we did express router.
app.use("/listings",listing_router);

//This is the Review middleware, that we did express router.
app.use("/listings/:id/reviews",review_router);

//sign up router
app.use("/",user_router);




// if no one route is match then send this error page not found!!
app.use((req,res,next)=>{

    next(new ExpressError(404,"Page Not Found!"));  // it can throw the error , then its go to the error handling middleware.
});


//error handling middleware 
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});


app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});