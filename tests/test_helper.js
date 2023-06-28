const Blog = require('../models/blog.js')

const initialBlogs = [
    {
      title: "Test 1",
      author: "Nick",
      url: "www.nick.com",
      likes: 0,
    },
    {
      title: "Test 2",
      author: "Nick",
      url: "www.nick.com",
      likes: 0,
    },
  ];

  const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
  }

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  module.exports = {
    initialBlogs, nonExistingId, blogsInDb
  }