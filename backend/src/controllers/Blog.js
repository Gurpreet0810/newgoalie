import BlogCategory from "../models/blogCategory.model.js";
import Blog from "../models/blog.model.js"; // Assuming this is the model for blog categories
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LoaderImages } from "../models/LoaderImage.model.js";
// Add a blog category
const addBlogCategory = asyncHandler(async (req, res) => {
  const { category_name, user_id } = req.body;

  // Validate required fields
  if (!category_name) {
    return res.status(404).json(new ApiError(404, [], "Category name is required"));
  }

  // Check if the user is authenticated
  if (!user_id) {
    return res.status(401).json(new ApiError(401, [], "User not authenticated"));
  }

  // Create a new BlogCategory instance
  const newCategory = new BlogCategory({
    category_name,
    user_id,
  });

  const addCategorySuccess = await newCategory.save();

  if (!addCategorySuccess) {
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while adding Category")
    );
  }

  return res.status(200).json(new ApiResponse(200, { addCategorySuccess }, "Category created successfully"));
});

// Get all blog categories
const getAllBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find(); // Fetch all categories
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single blog category by ID
const getSingleBlogCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a blog category
const updateBlogCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;

  try {
    // Construct the update fields
    const updateFields = {
      category_name,
    };

    // Perform the update operation
    const result = await BlogCategory.findByIdAndUpdate(id, updateFields, { new: true });

    if (result) {
      res.status(200).json(result); // Return the updated category
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a blog category
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Find the category by id and delete it
    const category = await BlogCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json(new ApiError(404, [], "Category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Category deleted successfully"));
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json(new ApiError(500, [], "Server error while deleting category"));
  }
});

const addBlog = asyncHandler(async (req, res) => {
  const { title, category, content, image, user_id } = req.body;
  const photo = req.image;

  // Validate required fields
  if (!title || !category || !content) {
    return res.status(404).json(new ApiError(404, [], "Title, category, and content are required"));
  }

  // Check if the user is authenticated
  if (!user_id) {
    return res.status(401).json(new ApiError(401, [], "User not authenticated"));
  }

  // Create a new BlogCategory instance
  const newBlog = new Blog({
    title,
    category,
    content,
    photo,
    user_id,
  });

  const addBlogSuccess = await newBlog.save();

  if (!addBlogSuccess) {
    return res.status(500).json(
      new ApiError(500, [], "Something went wrong while adding blog")
    );
  }

  return res.status(200).json(new ApiResponse(200, { addBlogSuccess }, "Blog created successfully"));
});


// Get all blog categories
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all categories
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a blog category
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Find the category by id and delete it
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json(new ApiError(404, [], "Blog not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Blog deleted successfully"));
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json(new ApiError(500, [], "Server error while deleting blog"));
  }
});

// Get single blog category by ID
const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a blog category
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, category, content } = req.body;
  const photo = req.image;

  try {
    // Construct the update fields
    const updateFields = {
      title, 
      category, 
      content
    };

    // Only add photo if it exists
    if (photo) {
      updateFields.photo = photo;
    }

    // Perform the update operation
    const result = await Blog.findByIdAndUpdate(id, updateFields, { new: true });

    if (result) {
      res.status(200).json(result); // Return the updated category
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { 
  addBlogCategory, 
  getAllBlogCategories, 
  getSingleBlogCategory, 
  updateBlogCategory, 
  deleteBlogCategory,
  addBlog,
  getAllBlogs,
  deleteBlog,
  getSingleBlog,
  updateBlog 
};
