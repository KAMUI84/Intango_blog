import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { db } from './src/config/db.js';
import authRoutes from "./src/Routes/authroutes.js";
import postRoutes from "./src/Routes/postRoutes.js";
import categoryRoutes from "./src/Routes/categoryRoutes.js";
import tagRoutes from "./src/Routes/tagRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

// Database connection
db.getConnection((err) => {
    if (err) {
        console.log(`Database encountered an error: ${err.message}`);
    } else {
        console.log(`Database connected successfully`);
    }
});


// Listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
