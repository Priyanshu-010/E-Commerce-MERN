import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Please add a name"],
  },
  email:{
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password:{
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  cartItems:[
    {
      quantity:{
        type:Number,
        default: 1
      },
      product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    }
  ],
  role:{
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  }
},{
  timestamps:true
})

// Pre save middlware to hash password before saving it
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next
  
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next();
  } catch (error) {
    next(error) 
  }
})

const User = mongoose.model("user", userSchema);
export default User