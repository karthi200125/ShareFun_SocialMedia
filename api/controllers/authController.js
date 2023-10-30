import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import JWT from 'jsonwebtoken';

export const Register = async (req, res, next) => {
    const { firstName, lastName, email, password, location, profileUrl, profession } = req.body;

    try {
        if (!(firstName && lastName && email && password)) {
            return res.status(400).json({
                success: false,
                message: "Please Provide User Credentials",
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "Email Already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            location: location || '', 
            profileUrl: profileUrl || '', 
            profession: profession || '', 
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const Login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!(email && password)) {
            return res.status(400).json({
                success: false,
                message: "Provide Required Fields!"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email Not Found"
            });
        }

        const CheckPassword = await bcrypt.compare(password, user.password);
        if (!CheckPassword) {
            return res.status(401).json({
                success: false,
                message: "Password Incorrect"
            });
        }

        const token = JWT.sign({ id: user._id }, "jwtsecretkey", { expiresIn: "1d" });

        user.password = undefined;
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({
            success: true,
            message: "Login successfully",
            user,
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const Logout = (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json("Logged out successfully");
};
