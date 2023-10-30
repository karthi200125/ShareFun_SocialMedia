import User from '../Models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const Register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json("User already exists")
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ username, email, password: hashedPassword });
        res.status(201).json("User created successfully");
    } catch (error) {
        res.status(500).json("Register Failed", error);
    }
};

export const Login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json("Wrong Email Address");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json("Wrong Password");

        const { password: userPassword, ...others } = user._doc;

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        res.cookie("access_token", token).status(200).json(others);
    } catch (error) {
        console.error(error);
        res.status(500).json("Login failed");
    }
};

export const Logout = async (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json("Logged out successfully");
}