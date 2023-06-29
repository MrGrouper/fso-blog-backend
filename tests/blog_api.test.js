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

describe('exercise 4.8', () => {
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
})

describe('Exercise 4.9', () => {
test("id is defined", async () => {
    const response = await api.get("/api/blogs");
    const ids = response.body.map(r => r.id)

    ids.map(id => expect(id).toBeDefined());
   
  });
})

describe('Exercise 4.10', () => {
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
})

describe('Exercise 4.11', () => {
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
})

describe('Exercise 4.12', () => {
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
})

describe('Exercise 4.13', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
    
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(
          helper.initialBlogs.length - 1
        )
    
        const titles = blogsAtEnd.map(r => r.title)
    
        expect(titles).not.toContain(blogToDelete.title)
      })
    })

    describe('Exercise 4.14', () => {
        test('Updating likes returns correct number of likes', async () => {
            
            const updatedBlog =     {
                title: "Test 1",
                author: "Nick",
                url: "www.nick.com",
                likes: 4,
              }
            const blogsAtStart = await helper.blogsInDb()
        
            const blogToUpdate = blogsAtStart[0]

          
            
            await api
              .put(`/api/blogs/${blogToUpdate.id}`)
              .send(updatedBlog)
              .expect(200)
        
            const blogsAtEnd = await helper.blogsInDb()
        
            expect(blogsAtEnd).toHaveLength(
              helper.initialBlogs.length
            )
            expect(blogsAtEnd[0].likes).toBe(4)
          })
        })


afterAll(async () => {
  await mongoose.connection.close();
});