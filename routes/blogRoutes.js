const express = require("express");
const { default: mongoose } = require("mongoose");
const Blogs = require("./../models/blogs");
const router = express.Router();

// Getting all blogs
router.get("/", async (req, res) => {
  try {
    const blogsData = await Blogs.find();
    if (!blogsData) {
      res.status(200).json({ message: "No Blogs Found" });
    }
    res.status(200).json({ message: "Success", data: blogsData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Getting One
router.get("/:id", getBlogDetail, (req, res) => {
  res.status(200).json({ message: "Successfully fetched", data: res.blog });
});

// Creating one
router.post("/", async (req, res) => {
  const blog = new Blogs({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const newBlog = await blog.save();
    res.status(200).json({ message: "Successfully created", data: newBlog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getBlogDetail, async (req, res) => {
  if (req.body.title != null) {
    res.blog.title = req.body.title;
  }
  if (req.body.description != null) {
    res.blog.description = req.body.description;
  }
  try {
    const updatedBlog = await res.blog.save();
    res
      .status(200)
      .json({ message: "Successfully Updated", data: updatedBlog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getBlogDetail, async (req, res) => {
  try {
    await res.blog.remove();
    res.json({ message: "Deleted Blog" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBlogDetail(req, res, next) {
  let blog;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Enter a valid ObjectId" });
    }
    blog = await Blogs.findById(mongoose.Types.ObjectId(req.params.id));
    if (blog == null) {
      return res.status(404).json({ message: "Cannot find the blog" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blog = blog;
  next();
}

module.exports = router;
