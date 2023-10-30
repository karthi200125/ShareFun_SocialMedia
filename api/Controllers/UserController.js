import User from '../Models/UserModel.js'

export const UpdateUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const { username, phoneNo, profilePic, street, city, state, zipCode } = req.body;
        const user = await User.findByIdAndUpdate(userId, {
            $set: { username, phoneNo, profilePic, address: { street, city, state, zipCode } }
        }, { new: true });
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json({ message: "User Update Failed", error: error.message });
    }
};

export const addUserCartProducts = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        user.cartProducts.push(req.body);
        await user.save();
        res.status(200).json(`Cart product successfully added to ${user.username}`);
    } catch (error) {
        res.status(500).json({ message: "Cart product upload failed", error: error.message });
    }
};

export const removeUserCartProducts = async (req, res, next) => {
    const { userId } = req.params;
    const { productId } = req.body;    
    try {
        const user = await User.findById(userId);
        const productIndex = user.cartProducts.findIndex(product => product._id === productId);
        if (productIndex !== -1) {
            user.cartProducts.splice(productIndex, 1);
            await user.save();
            res.status(200).json(`Product successfully removed from ${user.username}'s cart`);
        } else {
            res.status(404).json(`Product with ID ${productId} not found in ${user.username}'s cart`);
        }
    } catch (error) {
        res.status(500).json({ message: "Product removal failed", error: error.message });
    }
};

export const addUserFavProducts = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        user.favProducts.push(req.body);
        await user.save();
        res.status(200).json(`wishlist product successfully added to ${user.username}`);
    } catch (error) {
        res.status(500).json({ message: "wishlist product upload failed", error: error.message });
    }
};

export const removeUserFavProducts = async (req, res, next) => {
    const { userId } = req.params;
    const { productId } = req.body;    
    try {
        const user = await User.findById(userId);
        const productIndex = user.favProducts.findIndex(product => product._id === productId);
        if (productIndex !== -1) {
            user.favProducts.splice(productIndex, 1);
            await user.save();
            res.status(200).json(`Product successfully removed from ${user.username}'s cart`);
        } else {
            res.status(404).json(`Product with ID ${productId} not found in ${user.username}'s wishlist`);
        }
    } catch (error) {
        res.status(500).json({ message: "Product removal failed", error: error.message });
    }
};










