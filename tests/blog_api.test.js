const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require('./test_helper')
const app = require("../app");
mongoose.set("bufferTimeoutMS", 300000);
const api = supertest(app);
const Blog = require("../models/blog");


beforeEach(async () => {
  await Blog.deleteMany({});
 
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
},100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(2);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("id is defined", async () => {
    const response = await api.get("/api/blogs");
    const ids = response.body.map(r => r.id)

    const check = ids.map(id => expect(id).toBeDefined());
   
  });

test('post works', async () => {
    const newBlog = {
        title: 'adding blogs works!',
        author: 'New guy',
        url: "www.hatshatshatsletsparty.com",
        likes: 0,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
          expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)

        expect(titles).toContain(
            'adding blogs works!'
        )


}, 300000)

test('blog without title is not added', async () => {
    const newBlog = {
      author: 'john',
      url: 'www.cats.com',
      likes: 0
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

afterAll(async () => {
  await mongoose.connection.close();
});

test('blog without likes is default to 0', async () => {
    const newBlog = {
        title: 'The likes should be 0',
        author: 'New guy',
        url: "www.hatshatshatsletsparty.com",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
  
    const blogsAtEnd = await helper.blogsInDb()
    console.log(blogsAtEnd)
  
    expect(blogsAtEnd[2].likes).toEqual(0)
  })

afterAll(async () => {
  await mongoose.connection.close();
});