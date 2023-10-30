import Product from "../Models/ProductModel.js";

export const createProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(200).json({ message: "Product has been created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Product creation failed", error });
    }
};

export const updateProduct = async (req, res, next) => {
    const { postId } = req.params
    try {
        const updateProduct = await Product.findByIdAndUpdate(postId, req.body, { new: true });
        res.status(200).json({ message: "Product has been updated successfully", product: updateProduct });
    } catch (error) {
        res.status(500).json({ message: "Product update failed", error });
    }
};

export const DeleteProduct = async (req, res, next) => {
    const { postId } = req.params
    try {
        await Product.findByIdAndDelete(postId);
        res.status(200).json({ message: "Product has been deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Product Delete failed", error });
    }
};

export const getcategoryProducts = async (req, res, next) => {
    const { cat } = req.query;    
    try {
        const allproducts = await Product.find({ category: cat });
        res.status(200).json({ message: "Successfully retrieved products in the category", allproducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve products", error });
    }
};

export const getallProducts = async (req, res, next) => {    
    try {
        const allproducts = await Product.find();
        res.status(200).json({ message: "Successfully retrieved all products", allproducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve all products", error });
    }
};

export const singleProduct = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const product = await Product.findById(postId);
        res.status(200).json({ message: "sucess", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed", error });
    }
};

