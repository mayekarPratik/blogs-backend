const express = require("express");
const mongoose = require("mongoose");
const blogsRouter = require("./routes/blogRoutes");

// Set up the server
const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", () => console.log("Connected to MongoDB Atlas"));

// Check server status
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server running",
  });
});

// Connect server to routes
app.use("/blogs", blogsRouter);

// Listen on specified port or port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
