const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 4){
    return response.json({
        error: 'password must be greater than 3 characters'
      })
  }
  if(username.length < 4){
    return response.json({
        error: 'username must be greater than 3 characters'
      })
  }
  else{
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
}
})

usersRouter.get('/', async (request, response) => {
    const users = await User 
       .find({}).populate('blogs', {title: 1, author: 1})
    response.json(users)
  })

module.exports = usersRouter