const mongoose=require("mongoose");

const applicationSchema=new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  company:{
    type:String,
    required:[true,"company name is required"],
    trim:true
  },
  role:{
    type:String,
    required:[true,"role is required"],
    trim:true
  },
  status:{
    type:String,
    enum:['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
    default:'Applied'
  },
  jdLink:{
    type:String,
    default:''
  },
  notes:{
    type:String,
    default:''
  },
  dateApplied:{
    type:Date,
    default:Date.now
  },
  salaryRange:{
    type:String,
    trim:true
  },
  requiredSkills:{
    type:[String],
    default:[]
  },
  niceToHaveSkills:{
    type:[String],
    default:[]
  },
  location:{
    type:String,
    trim:true
  },
  seniority:{
    type:String,
    enum:['Junior','Mid','Senior', 'Lead', 'Not Specified']
  },
  resumeSuggestions:{
    type:[String],
    default:[]
  }
},{timestamps:true});

const Application=mongoose.model("Application",applicationSchema);

module.exports=Application;