import express from "express";
import cors from "cors";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

// --- IMPORTANT: CORS MUST BE AT THE TOP ---
app.use(cors({
  origin: "http://localhost:8080",   // your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);

// Error middleware
app.use(errorMiddleware);

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
