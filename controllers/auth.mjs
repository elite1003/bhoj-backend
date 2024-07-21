import bcrypt from "bcrypt";
import User from "../models/user.mjs";
import { transporter } from "../utils/emailer.mjs";
import {
  generateToken,
  generateTokenForForgetPassword,
} from "../utils/jwt.mjs";

export const postSignUp = async (req, res, next) => {
  const user = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email: user.email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create a new user and save into database
    const newUser = await User.create(user);
    await newUser.createCart();
    res.status(201).json("User created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postLogin = async (req, res, next) => {
  const userData = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email: userData.email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or user doesn't exist" });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    //Authentication successful
    const jwtToken = generateToken(user);
    res.status(200).json({ message: "Login successful", jwtToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postForgetPassword = async (req, res, next) => {
  const userData = req.body;
  const user = await User.findOne({ where: { email: userData.email } });
  if (!user) {
    return res.status(404).json("user not found");
  }
  const token = generateTokenForForgetPassword(user);

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password Reset",
    text: `Please use the following link to reset your password: http://localhost:4000/reset-password?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json(error.toString());
    }
    res.send("Password reset link sent to your email.");
  });
};

export const postResetPassword = (req, res, next) => {
  const userData = req.body;
  req.user.password = userData.newPassword;
  req.user
    .save()
    .then(() => res.status(200).json("Password has been reset"))
    .catch((error) => res.status(500).json(error.toString()));
};
