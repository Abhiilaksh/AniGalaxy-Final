const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://admin:RH5X6yk2uMK4HUgY@cluster0.thr1gjn.mongodb.net/anime");
console.log("database running");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minLength:6,
        maxLength:30

    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true,
        maxLength:30
    },
    lastName:{
        type:String,
        required:true,
        maxLength:30
    }
});


const CommentSchema = new mongoose.Schema({
    animeId: { type: String, required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User=mongoose.model('User',userSchema)
const Comment=mongoose.model("Comment",CommentSchema)


module.exports={
    User,
    Comment
};