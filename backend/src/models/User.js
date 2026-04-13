const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,"name is required"],
    trim:true,
    minLength:[2,"name must be atleast 2 characters"]
  },
  email:{
    type:String,
    required:[true,"email is required"],
    unique:true,
    trim:true,
    lowercase:true,
    match:[/^\S+@\S+\.\S+$/, "plz enter a valid email"]
  },
  password:{
    type:String,
    required:[true,"password is required"],
    minLength:[6,"password must be atleast 6 characters"]
  }
},{timestamps:true});

userSchema.pre('save',async function () {
  if(!this.isModified("password")) return;
  const salt=await bcrypt.genSalt(12);
  this.password=await bcrypt.hash(this.password,salt);
});

userSchema.methods.comparePassword=async function (candidatePassword) {
  return bcrypt.compare(candidatePassword,this.password)
};

const User=mongoose.model("User",userSchema);

module.exports=User;