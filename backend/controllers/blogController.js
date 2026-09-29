import Blog from "../models/Blog.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      contentType,
      contentUrl
    } = req.body;

    let finalUrl = contentUrl;

    // If content is image, gif, or video
    if (contentType !== "url") {

      if (!req.file) {
        return res.status(400).json({
          message: "File is required"
        });
      }

      const resourceType =
        contentType === "video" ? "video" : "image";

      const result = await uploadToCloudinary(
        req.file.buffer,
        resourceType
      );

      finalUrl = result.secure_url;
    }

    // If content is URL
    if (contentType === "url" && !contentUrl) {
      return res.status(400).json({
        message: "URL is required"
      });
    }

    const blog = await Blog.create({
      title,
      description,
      contentType,
      contentUrl: finalUrl
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};
// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
//getBlogById
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json(blog);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
// updateBlog
export const updateBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      contentType,
      contentUrl
    } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    let finalUrl = blog.contentUrl;

    // New file uploaded
    if (contentType !== "url" && req.file) {
      const resourceType =
        contentType === "video" ? "video" : "image";

      const result = await uploadToCloudinary(
        req.file.buffer,
        resourceType
      );

      finalUrl = result.secure_url;
    }

    // URL content
    if (contentType === "url") {
      if (!contentUrl) {
        return res.status(400).json({
          message: "URL is required"
        });
      }

      finalUrl = contentUrl;
    }

    blog.title = title;
    blog.description = description;
    blog.contentType = contentType;
    blog.contentUrl = finalUrl;

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};
// delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json({
      message: "Blog deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
//like Blog
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json({
      message: "Blog liked successfully",
      likes: blog.likes
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};