const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByPlaceholder('title').fill(title)
    await page.getByPlaceholder('author').fill(author)
    await page.getByPlaceholder('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(title).waitFor()
}

const likeBlogNtimes = async (page, title, url, N) => {

    await page.getByText(title).getByRole('button', { name: 'view' }).click()
    for(;i < N; ){
        await page.getByText(url).getByRole('button', { name: 'like' }).click()
        await page.getByText('testblog1.fi').getByTestId('like_count').waitFor()
    }
}



export { loginWith, createBlog, likeBlogNtimes }

