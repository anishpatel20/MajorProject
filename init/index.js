const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { init } = require("../models/user.js");
// const { init } = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"
main()
    .then(()=>{
        console.log("Database connection successful");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
  } 

// if the data is present already then first we can delete that data

const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj,owner:"6986371403f5f68061682737"}));  
   await Listing.insertMany(initData.data); 
   console.log("data was initilazed");
}
  
initDB();