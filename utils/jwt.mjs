import jwt from "jsonwebtoken";
import User from "../models/user.mjs";

export const generateToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secretKey,
    { expiresIn: "24h" } // Token expires in 24 hour
  );
};

export const generateForgetPasswordToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secretKey,
    { expiresIn: "1h" }
  );
};

export const verifyHeaderToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json("Token is required.");
  }
  verify(req, res, next, token);
};

export const verifyQueryToken = (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return res.status(401).json("Token is required.");
  }
  verify(req, res, next, token);
};
const verify = (req, res, next, token) => {
  const secretKey = process.env.JWT_SECRET;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(400).json("Invalid token.");
    }
    const user = await User.findByPk(decoded.id);
    req.user = user;
    next();
  });
};
