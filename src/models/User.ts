import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});
export default mongoose.models.User || mongoose.model("User", userSchema);