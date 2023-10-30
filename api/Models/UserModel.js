import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, unique: true, required: true },
    profilePic: { type: String },
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        }
    },
    phoneNo: { type: String },
    isAdmin: { type: Boolean, default: false },
    cartProducts: { type: Array },
    favProducts: { type: Array },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]

}, { timestamps: true });

export default mongoose.model("User", UserSchema);
