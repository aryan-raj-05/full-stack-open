import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Testing React components',
    author: 'Kent C. Dodds',
    url: 'https://testing-library.com/',
    likes: 10,
    user: { name: 'testuser' }
  }

  const loggedInUser = 'testuser'
  const mockLike = vi.fn()
  const mockDelete = vi.fn()

  render(
    <Blog
      blog={blog}
      loggedInUser={loggedInUser}
      onLike={mockLike}
      onDelete={mockDelete}
    />
  )

  expect(screen.getByText('Testing React components Kent C. Dodds')).toBeDefined()

  expect(screen.queryByText('https://testing-library.com/')).not.toBeVisible()
  expect(screen.queryByText('10')).not.toBeVisible()
})
