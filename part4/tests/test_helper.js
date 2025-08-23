const Blog = require('../models/blog')
const User = require('../models/user')

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

module.exports = {
  initialBlogs,
  getBlogsInDB,
  initialUsers,
  uniqueUser,
  notUniqueUser,
  userWithShortUsername,
  userWithoutPassword,
  userWithShortPassword,
  getUsersInDB,
}