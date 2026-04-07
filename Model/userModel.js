import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username:   { type: String, required: true, unique: true, trim: true },
    password:   { type: String, required: true },
    year:       { type: Number, required: true },
    department: { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    age:        { type: Number, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
