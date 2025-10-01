const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'log in' }).click()
}

const createBlog = async (page, testTitle, testAuthor) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title:').fill(testTitle)
  await page.getByLabel('author:').fill(testAuthor)
  await page.getByLabel('url:').fill('test-site.com')
  await page.getByRole('button', { name: 'create' }).click()
}

module.exports = {
  loginWith,
  createBlog,
}