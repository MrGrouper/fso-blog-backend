const mongoose = require('mongoose')
mongoose.set("bufferTimeoutMS", 30000)

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url ='mongodb+srv://nusaha1:${password}@cluster0.h1ac1yo.mongodb.net/?retryWrites=true&w=majority'

mongoose.set('strictQuery',false)
mongoose.connect(url)
console.log('connected')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog1 = new Blog({
  title: 'First blog post',
  author: 'Nick',
  url: 'www.nick.com',
  likes: 0
})

const blog2 = new Blog({
  title: 'Second blog post',
  author: 'Nick',
  url: 'www.nick.com',
  likes: 0
})

blog1.save().then(result => {
  console.log('blog saved!')
})
  blog2.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})

// Blog.find({}).then(result => {
//   result.forEach(blog => {
//     console.log(blog)
//   })
//   mongoose.connection.close()
// })