import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true} ,
    date : {type : String , required : true} ,
    image :{type : Number , default : 0} ,
    tts :  {type : Number , default : 0} 
})
usageSchema.index({user : 1 , date : 1} , {unique : true})

export default mongoose.model("Usage" , usageSchema)