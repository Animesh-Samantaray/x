import Category from "../models/category.model.js";

// Create Category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(409).json({
                success: false,
                message: "User doesn't exists",
            });
        }
        const existingCategory = await Category.findOne({
            name: name.trim(),
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await Category.create({
            name,
            description,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message,
        });
    }
};

// Get All Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({
            name: 1,
        });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
};

// Get Category By ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message,
        });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        if (
            category.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to modify this category",
            });
        }

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({
                name: name.trim(),
                _id: { $ne: req.params.id },
            });

            if (existingCategory) {
                return res.status(409).json({
                    success: false,
                    message: "Category already exists",
                });
            }

            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message,
        });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (
            category.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to modify this category",
            });
        }
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
};