import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    productImg: { type: String, required: true },
});

export default mongoose.model("Product", ProductSchema);
