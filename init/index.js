const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");


let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res) => {
    console.log("connection succesfull");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'687df1d12fe512d45c22c37f'}));
    await Listing.insertMany(initdata.data)
    console.log("data was initialize");

};

initDB();

