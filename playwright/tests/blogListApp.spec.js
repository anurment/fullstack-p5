const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlogNtimes } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Aleksi Nurmento',
        username: 'testUser',
        password: 'sekret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', {name: 'log in'}).click()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    
    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'wrong')

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()

    })

  })

  describe('when logged in', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    describe('and several blogs exists', () => {
        beforeEach(async ({page}) => {
            await createBlog(page, 'test blog 1', 'test blogger 1', 'testblog1.fi')
            await createBlog(page, 'test blog 2', 'test blogger 2', 'testblog2.fi')
            await createBlog(page, 'test blog 3', 'test blogger 3', 'testblog3.fi')

        })
        test('the blogs are rendered', async ({ page }) => {
            await expect(page.getByText('test blog 1')).toBeVisible()
            await expect(page.getByText('test blog 2')).toBeVisible()
            await expect(page.getByText('test blog 3')).toBeVisible()
        })
        
        test('a blog can be liked', async ({ page }) => {
            await page.getByText('test blog 1').getByRole('button', { name: 'view' }).click()

            await expect(page.getByText('testblog1.fi').getByTestId('like_count')).toHaveText('0')
  
            await page.getByText('testblog1.fi').getByRole('button', { name: 'like' }).click()
            await page.getByText('testblog1.fi').getByTestId('like_count').waitFor()
            await expect(page.getByText('testblog1.fi').getByTestId('like_count')).toHaveText('1')

        })
         
        test('a blog can be deleted', async ({ page }) => {
            await page.getByText('test blog 1').getByRole('button', { name: 'view' }).click()
            page.on('dialog', dialog => dialog.accept());
            await page.getByText('testblog1.fi').getByRole('button', { name: 'remove' }).click()
            
            const notificationDiv = await page.locator('.notification')
            await expect(notificationDiv).toContainText('Removed blog test blog 1 by test blogger 1')
            await expect(notificationDiv).toHaveCSS('border-style', 'solid')
            await expect(notificationDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

        })

        test('only logged in user can see the remove button', async ({ page }) => {
            await page.getByRole('button', { name: 'logout'}).click()
            await loginWith(page, 'testUser', 'sekret')
            await page.getByText('test blog 1').getByRole('button', { name: 'view' }).click()
            await expect(page.getByText('testblog1.fi').getByRole('button', { name: 'remove' })).not.toBeVisible()

        })
        /*
        test('the blogs are ordered according to the likes', async ({ page }) => {
            await likeBlogNtimes(page, 'test blog 1', 'testblog1.fi', 5 )
            await likeBlogNtimes(page, 'test blog 2', 'testblog2.fi', 10 )
            await likeBlogNtimes(page, 'test blog 3', 'testblog3.fi', 20 )
        })
        */

         
    })
  
  })

})
