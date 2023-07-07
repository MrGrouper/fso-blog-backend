const Blog = require('../models/blog.js')
const User = require('../models/user')

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

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
  }