import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    currentOwner: mongoose.Types.ObjectId,
    title: String,
    type: String,
    desc: String,
    img: String,
    price: Number,
    sqmeters: Number,
    city: String,
    address: String,
    baths: Number,
    rooms: Number,
    featured: Boolean
  }
   ,
  { timestamps: true }
  
    
);

const Property = mongoose.model("Property", PropertySchema);
export default Property;
