import jwt from 'jsonwebtoken';

export const VerifyToken = (req, res, next) => {
    const token = req.cookies.access_token    
    if (!token) return res.status(401).json("You Are Not Authenticated");
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json("Token is Not Valid");
        req.userId = decoded;
        next();
    });
};

export const VerifyUser = (req, res, next) => {
    VerifyToken(req, res, () => {
        if (req.userId.userId === req.params.userId || req.userId.isAdmin === true) {
            next()
        } else {
            return res.status(403).json("You are not authorized");
        }
    });
};

export const VerifyAdmin = (req, res, next) => {
    VerifyToken(req, res, () => {
        if (req.userId.isAdmin === true) {
            next()
        } else {
            return res.status(403).json("You are not Admin");
        }
    });
};
