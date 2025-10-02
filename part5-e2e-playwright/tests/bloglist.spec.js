const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'User',
        password: 'testPassword124',
        name: 'testUser'
      }
    })
    await request.post('/api/users', {
      data: {
        username: 'otherUser',
        password: 'password123',
        name: 'User2'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('login to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'User', 'testPassword124')
      await expect(page.getByText('testUser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'User', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('testUser logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'User', 'testPassword124')
    })

    test('a new blog can be created', async ({ page }) => {
      createBlog(page, 'test title', 'test author')

      await expect(page.getByText('test title test author')).toBeVisible()
    })

    test('blogs can be liked', async ({ page }) => {
      createBlog(page, 'new title', 'new author')

      await page.getByRole('button', { name: 'view' }).click()

      const initialLikesLocator = page.locator('text=/^\\d+ likes?$/')
      const initialLikesText = await initialLikesLocator.textContent()
      const initialLikes = parseInt(initialLikesText.match(/\d+/)[0], 10)

      await page.getByRole('button', { name: 'like' }).click()

      await expect(initialLikesLocator).toContainText(`${initialLikes + 1}`)
    })

    test('user can delete the blogs they have created', async ({ page }) => {
      await createBlog(page, 'blog to delete', 'author')
      
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => { dialog.accept() })
      await page.getByRole('button', { name: 'remove' }).click()
      
      await expect(page.getByText('blog to delete author')).not.toBeVisible()
    })

    test('remove button is visible only for blogs user has created', async ({ page }) => {
      await createBlog(page, 'test remove button visibility', 'original user')

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'otherUser', 'password123')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})