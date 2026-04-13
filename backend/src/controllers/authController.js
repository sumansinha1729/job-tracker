const jwt=require("jsonwebtoken");
const User=require("../models/User");


const generateToken=(id,email)=>{
  return jwt.sign(
    {id,email},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN || "7d"}
  )
};


const register=async(req,res)=>{
  try {
    const {name,email,password}=req.body;

    if(!name || !email || !password){
      return res.status(409).json({
        success:false,
        message:"Name, email and password are required"
      })
    };

    const existing=await User.findOne({email:email.toLowerCase()});
    if(existing){
      return res.status(409).json({
        success:false,
        message:"An account with email already exists"
      })
    };

    const user=new User({name,email,password});
    await user.save();

    const token=generateToken(user._id.toString(),user.email);

    return res.status(201).json({
      success:true,
      message:"Account created successfully",
      data:{
        token,
        user:{id:user._id, name:user.name,email:user.email}
      }
    });
  } catch (error) {
    console.error("Error in register",error);
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
};


const login=async(req,res)=>{
  try {
    const {email,password}=req.body;

    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Email and password is required"
      })
    };

    const user=await User.findOne({email:email.toLowerCase()});
    if(!user){
      return res.status(401).json({
        success:false,
        message:"Invalid email or password"
      })
    };

    const isValid=await user.comparePassword(password);
    if(!isValid){
      return res.status(401).json({
        success:false,
        message:"Invalid email or password"
      })
    };

    const token=generateToken(user._id.toString(),user.email);

    return res.status(200).json({
      success:true,
      message:"Login successful",
      data:{
        token,
        user:{id:user._id, name:user.name, email:user.email}
      }
    })
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
};


const getMe=async(req,res)=>{
  try {
    const user=await User.findById(req.user.id).select("-password");
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    };

    return res.status(200).json({
      success:true,
      data:{user}
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
};

module.exports={
  register,
  login,
  getMe
}