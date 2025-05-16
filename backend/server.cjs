  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");

  const app = express();
  const PORT = 5000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public")); // or your frontend build folder


  // MongoDB Connection
  mongoose.connect("mongodb://127.0.0.1:27017/feedback_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

  // Feedback Schema
  const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,   // changed Int32 to Number (Mongoose uses Number type)
    message: String,
  });
  const Feedback = mongoose.model("Feedback", feedbackSchema);

  // Product Schema
  const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imageUrl: String,
  });
  const Product = mongoose.model("Product", productSchema);

  // Cart Item Schema
  const cartItemSchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
  });
  const CartItem = mongoose.model("CartItem", cartItemSchema);

  // Root Route
  app.get("/", (req, res) => {
    res.send("API is working. Use POST /submit to send feedback.");
  });

  // Submit Feedback
  app.post("/submit", async (req, res) => {
    try {
      const feedback = new Feedback(req.body);
      await feedback.save();
      res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (err) {
      res.status(400).json({ error: "Failed to submit feedback" });
    }
  });

  // Get All Feedbacks
  app.get("/messages", async (req, res) => {
    try {
      const feedbacks = await Feedback.find();
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Get All Products
  app.get("/products", async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Add to Cart
  app.post("/cart", async (req, res) => {
    try {
      const item = new CartItem(req.body);
      await item.save();
      res.json({ message: "Item added to cart" });
    } catch (err) {
      res.status(400).json({ error: "Failed to add item to cart" });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
