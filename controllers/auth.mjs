import bcrypt from "bcrypt";
import User from "../models/user.mjs";
import { generateToken } from "../utils/jwt.mjs";

export const postSignUp = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create a new user and save into database
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });
    await newUser.createCart();
    res.status(201).json({ email: newUser.email, id: newUser.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postLogin = async (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or user doesn't exist" });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    //Authentication successful
    const jwtToken = generateToken(user);
    res.status(200).json({ message: "Login successful", jwtToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
