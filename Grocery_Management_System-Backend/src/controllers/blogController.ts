import { Request, Response } from "express";
import Blog from "../models/blogModel"


export const getBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogs = await Blog.find().sort({ publishedDate: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs" });
    }
};


export const getBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog" });
    }
};


export const getBlogsByYear = async (req: Request, res: Response): Promise<void> => {
    try {
        const year = parseInt(req.params.year);
        const blogs = await Blog.find({
            publishedDate: { 
                $gte: new Date(`${year}-01-01`), 
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs by year" });
    }
};


export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error creating blog" });
    }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error updating blog" });
    }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog" });
    }
};