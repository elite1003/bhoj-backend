import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { verifyHeaderToken, verifyQueryToken } from "./utils/jwt.mjs";
import sequelize from "./utils/database.mjs";
import { v2 as cloudinary } from "cloudinary";
import { associations } from "./utils/associations.mjs";

//routes
import adminRoutes from "./routes/admin.mjs";
import userRoutes from "./routes/user.mjs";
import authRoutes from "./routes/auth.mjs";
import shopRoutes from "./routes/shop.mjs";
import categoryRoutes from "./routes/category.mjs";
import forgetPasswordRoute from "./routes/forget-password.mjs";
import resetPasswordRoute from "./routes/reset-password.mjs";
import { error404 } from "./controllers/error.mjs";

dotenv.config();
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);
app.use("/forget-password", forgetPasswordRoute);
app.use("/category", categoryRoutes);
app.use("/reset-password", verifyQueryToken, resetPasswordRoute);
app.use("/admin", verifyHeaderToken, adminRoutes);
app.use("/user", verifyHeaderToken, userRoutes);
app.use(error404);

//associations
associations();

sequelize
  .sync()
  .then(() => {
    console.log("successfully connected to database");
    app.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  })
  .catch((err) => {
    console.log("Error in connecting with database\n", err);
  });
