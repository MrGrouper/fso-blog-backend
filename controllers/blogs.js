const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//       if (authorization && authorization.startsWith('Bearer ')){    
//         return authorization.replace('Bearer ', '')  
//       }  
//       return null
//     }

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs);
});

blogsRouter.get("/:id", async(request, response, next) => {
  const blog = await Blog.findById(request.params.id)
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  
    const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog);

});

blogsRouter.delete("/:id", async (request, response, next) => {

  const user = request.user
  const blog = await Blog.findById(request.params.id)
  console.log(blog,'blog')
  if ( blog.user.toString() === user.id.toString() ){
    await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end();
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
}
});

module.exports = blogsRouter;
