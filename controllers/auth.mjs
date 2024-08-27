import bcrypt from "bcrypt";
import User from "../models/user.mjs";
import { transporter } from "../utils/emailer.mjs";
import { generateToken, generateForgetPasswordToken } from "../utils/jwt.mjs";

export const postSignUp = async (req, res, next) => {
  const user = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      where: { email: user.email, role: user.role },
    });
    if (existingUser) {
      return res.status(400).json("User already exists, please Login");
    }
    // Create a new user and save into database
    const newUser = await User.create(user);
    if (newUser.role === "user") await newUser.createCart();
    return res.status(201).json("created new user successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const postLogin = async (req, res, next) => {
  const userData = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({
      where: { email: userData.email, role: userData.role },
    });
    if (!user) {
      return res.status(404).json("Invalid email or user doesn't exist");
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid email or password");
    }
    //Authentication successful
    const jwtToken = generateToken(user);
    res.status(200).json({
      jwtToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const postForgetPassword = async (req, res, next) => {
  const userData = req.body;
  const user = await User.findOne({
    where: { email: userData.email, role: userData.role },
  });
  if (!user) {
    return res.status(404).json("user not found");
  }
  const token = generateForgetPasswordToken(user);

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
    return res.send(`Password reset link sent to your email. ${info.response}`);
  });
};

export const postResetPassword = (req, res, next) => {
  const userData = req.body;
  req.user.password = userData.password;
  req.user
    .save()
    .then(() => res.status(200).json("Password has been reset"))
    .catch((error) => res.status(500).json(error.toString()));
};
