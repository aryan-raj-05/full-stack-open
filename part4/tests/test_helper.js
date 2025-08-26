const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

const newBlog = {
  title: 'Billie Jean',
  author: 'Michael Jackson',
  url: 'yt.com',
  likes: 243
}

const getBlogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const initialUsers = [
  {
    username: 'alan-turing',
    passwordHash: 'turing-machines',
    name: 'Alan Turing'
  },
  {
    username: 'ada-love',
    passwordHash: 'first-programmer',
    name: 'Ada Lovelace'
  }
]

const uniqueUser = {
  username: 'babbage',
  password: 'differential-engine',
  name: 'Charles Babbage'
}

const notUniqueUser = {
  username: 'alan-turing',
  password: '12345',
  name: 'Alan Turing'
}

const userWithShortUsername = {
  username: 'ab',
  password: 'abcdefgh',
  name: 'John'
}

const userWithoutPassword = {
  username: 'xyz',
  name: 'X.Y.Z'
}

const userWithShortPassword = {
  username: 'dijkstra',
  password: 'cd',
  name: 'Edgar Dijkstra'
}

const getUsersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const loginUser = {
  username: 'mjackson',
  password: 'beat-it',
}

const addLoginUser = async () => {
  const passwordHash = await bcrypt.hash(loginUser.password, 10)
  const user = new User({ username: loginUser.username, passwordHash, name: 'Michael Jackson' })
  await user.save()
}

module.exports = {
  initialBlogs,
  newBlog,
  getBlogsInDB,
  initialUsers,
  uniqueUser,
  notUniqueUser,
  userWithShortUsername,
  userWithoutPassword,
  userWithShortPassword,
  getUsersInDB,
  loginUser,
  addLoginUser,
}