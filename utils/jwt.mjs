import jwt from "jsonwebtoken";
import User from "../models/user.mjs";

export const generateToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secretKey,
    { expiresIn: "24h" } // Token expires in 24 hour
  );
};

export const verifyToken = (req, res, next) => {
  const secretKey = process.env.JWT_SECRET;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token is required." });
  }
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    const user = await User.findByPk(decoded.id);
    req.user = user;
    next();
  });
};
