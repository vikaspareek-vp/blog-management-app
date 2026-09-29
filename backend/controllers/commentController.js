import Comment from "../models/Comment.js";
//add Comment
export const addComment = async (req, res) => {
  try {
    const { name, text } = req.body;

    const comment = await Comment.create({
      blog: req.params.id,
      name,
      text
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
// get all comment 
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.id
    });

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
// delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    res.status(200).json({
      message: "Comment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};