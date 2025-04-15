import request from "supertest";
import mongoose from "mongoose";
import app from "../app"; 
import Blog from "../models/blogModel";

describe("Blog API Integration Tests", () => {
  it("should create a new blog", async () => {
    const newBlog = {
      title: "Test Blog",
      content: "This is a test blog content",
      author: "Test Author",
      image: "test-image-url",
      publishedDate: new Date(),
    };

    const response = await request(app)
      .post("/api/blogs/")
      .send(newBlog)
      .expect(201);

    expect(response.body.title).toBe(newBlog.title);
    expect(response.body.content).toBe(newBlog.content);
  });

  it("should fetch all blogs", async () => {
    const blog1 = new Blog({
      title: "Blog 1",
      content: "Content 1",
      author: "Author 1",
      image: "image1-url",
      publishedDate: new Date(),
    });
    const blog2 = new Blog({
      title: "Blog 2",
      content: "Content 2",
      author: "Author 2",
      image: "image2-url",
      publishedDate: new Date(),
    });

    await blog1.save();
    await blog2.save();

    const response = await request(app)
      .get("/api/blogs/")
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe(blog2.title); // Sorted by publishedDate
    expect(response.body[1].title).toBe(blog1.title);
  });

  it("should fetch a blog by ID", async () => {
    const blog = new Blog({
      title: "Blog by ID",
      content: "Content by ID",
      author: "Author by ID",
      image: "image-by-id-url",
      publishedDate: new Date(),
    });

    await blog.save();

    const response = await request(app)
      .get(`/api/blogs/${blog._id}`)
      .expect(200);

    expect(response.body.title).toBe(blog.title);
  });

  it("should fetch blogs by year", async () => {
    const blog1 = new Blog({
      title: "Blog 1",
      content: "Content 1",
      author: "Author 1",
      image: "image1-url",
      publishedDate: new Date("2022-01-01"),
    });
    const blog2 = new Blog({
      title: "Blog 2",
      content: "Content 2",
      author: "Author 2",
      image: "image2-url",
      publishedDate: new Date("2022-06-01"),
    });
    const blog3 = new Blog({
      title: "Blog 3",
      content: "Content 3",
      author: "Author 3",
      image: "image3-url",
      publishedDate: new Date("2023-01-01"),
    });

    await blog1.save();
    await blog2.save();
    await blog3.save();

    const response = await request(app)
      .get("/api/blogs/year/2023")
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe(blog3.title);
    // expect(response.body[1].title).toBe(blog1.title);
  });

  it("should update a blog", async () => {
    const blog = new Blog({
      title: "Blog to Update",
      content: "Content to Update",
      author: "Author to Update",
      image: "image-to-update-url",
      publishedDate: new Date(),
    });

    await blog.save();

    const updatedData = {
      title: "Updated Blog",
      content: "Updated Content",
    };

    const response = await request(app)
      .put(`/api/blogs/${blog._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.content).toBe(updatedData.content);
  });

  it("should delete a blog", async () => {
    const blog = new Blog({
      title: "Blog to Delete",
      content: "Content to Delete",
      author: "Author to Delete",
      image: "image-to-delete-url",
      publishedDate: new Date(),
    });

    await blog.save();

    const response = await request(app)
      .delete(`/api/blogs/${blog._id}`)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Blog deleted successfully");

    const deletedBlog = await Blog.findById(blog._id);
    expect(deletedBlog).toBeNull();
  });
});