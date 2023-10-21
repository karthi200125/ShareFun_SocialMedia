import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is Required!"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required!"],
    },
    email: {
        type: String,
        required: [true, "Email is Required!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minlength: [6, "Password length should be greater than 6 characters"],
        select: true,
    },
    location: {
        type: String,
        default: '', 
    },
    profileUrl: {
        type: String,
        default: '', 
    },
    profession: {
        type: String,
        default: '', 
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
    }],
    views: [{
        type: String,
    }],
    verified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
