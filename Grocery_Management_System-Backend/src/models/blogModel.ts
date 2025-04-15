import { Schema, model } from 'mongoose';
import { IBlog } from '../interfaces/blogInterface';

const blogSchema = new Schema<IBlog>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    publishedDate: { type: Date, required: true }
}, { timestamps: true });

const Blog = model<IBlog>('Blog', blogSchema);

export default Blog;