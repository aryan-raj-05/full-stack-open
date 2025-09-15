import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const updateBlog = async (blog) => {
  const url = `${baseUrl}/${blog.id}`
  const response = await axios.put(url, blog)
  return response.data
}

export default {
  setToken,
  getAll,
  create,
  updateBlog,
}