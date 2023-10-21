import jwt from 'jsonwebtoken';

export const verifytoken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("You are not authenticated");
  }

  jwt.verify(token,"jwtsecretkey", (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid");      
    }
    req.user = user;    
    next();
  });
};

export const verifyuser = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.id === req.params.id ) {
      next();
    } else {
      return res.status(403).json("You are not authorized");
    }
  });
};