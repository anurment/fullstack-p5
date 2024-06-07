import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'
import LoginForm from './LoginForm'



test('renders only title and author', () => {

    const testUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen'
    }

    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'testblog.fi',
        likes: 1000,
        user: testUser
    }
        render(<Blog blog={testBlog} user={testUser} />)

        

        const titleElement = screen.queryByText('test title')
        const authorElement = screen.queryByText('test author')
        const urlElement = screen.queryByText('testblog.fi')
        const likesElement = screen.queryByText('1000')

        expect(titleElement).toBeDefined()
        expect(authorElement).toBeDefined()
        expect(urlElement).toBeNull()
        expect(likesElement).toBeNull()


})

test('renders all information after button click', async () => {

    const testUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen'
    }

    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'testblog.fi',
        likes: 1000,
        user: testUser
    }
        render(<Blog blog={testBlog} user={testUser} />)

        let titleElement = screen.queryByText('test title')
        let authorElement = screen.queryByText('test author')
        let urlElement = screen.queryByText('testblog.fi')
        let likesElement = screen.queryByText('1000')

        expect(titleElement).toBeDefined()
        expect(authorElement).toBeDefined()
        expect(urlElement).toBeNull()
        expect(likesElement).toBeNull()

        const user = userEvent.setup()

        const button = screen.getByText('view')

        await user.click(button)

        titleElement = screen.queryByText('test title')
        authorElement = screen.queryByText('test author')
        urlElement = screen.queryByText('testblog.fi')
        likesElement = screen.queryByText('1000')

        expect(titleElement).toBeDefined()
        expect(authorElement).toBeDefined()
        expect(urlElement).toBeDefined()
        expect(likesElement).toBeDefined()


})

test('if like button is clicked twice, the event handler is called twice', async () => {

    const testUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen'
    }

    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'testblog.fi',
        likes: 1000,
        user: testUser
    }
    
    const mockHandler = vi.fn()

    render(<Blog blog={testBlog} user={testUser} updateLikes={mockHandler}  />)

    const user = userEvent.setup()

    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)


})
