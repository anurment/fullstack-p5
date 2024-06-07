import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'



test('<BlogForm /> updates parent state and calls onSubmit', async () => {

    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'testblog.fi',
    }

    const user = userEvent.setup()
    const createBlog = vi.fn()
    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, testBlog.title)
    await user.type(authorInput, testBlog.author)
    await user.type(urlInput, testBlog.url)
    
    await user.click(sendButton)

    console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title')
    expect(createBlog.mock.calls[0][0].author).toBe('test author')
    expect(createBlog.mock.calls[0][0].url).toBe('testblog.fi')

})
