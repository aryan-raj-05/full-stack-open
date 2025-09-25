import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let loggedInUser
  let mockLike
  let mockDelete

  beforeEach(() => {
    blog = {
      title: 'Testing React components',
      author: 'Kent C. Dodds',
      url: 'https://testing-library.com/',
      likes: 10,
      user: { name: 'testuser' }
    }

    loggedInUser = 'testUser'
    mockLike = vi.fn()
    mockDelete = vi.fn()

    render(
      <Blog
        blog={blog}
        loggedInUser={loggedInUser}
        onLike={mockLike}
        onDelete={mockDelete}
      />
    )
  })

  test('renders title and author but not url or likes by default', () => {
    expect(screen.getByText('Testing React components Kent C. Dodds')).toBeDefined()
    expect(screen.getByText('https://testing-library.com/')).not.toBeVisible()
    expect(screen.getByText('10')).not.toBeVisible()
  })

  test('when view button is clicked url and likes are visible', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://testing-library.com/')).toBeDefined()
    expect(screen.getByText('10')).toBeVisible()
  })

  test('when like button is cliked twice, the assiciated event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})