/*
// Unit Test
const { findFreeLiId } = require('./script')
test('Able to find a free nubmer?', () => {
  expect(findFreeLiId()).not.toBeNaN()
})
*/

// End to end test
const puppeteer = require('puppeteer')

test('if h2 exists', async () => {
  let browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    args: ['--window-size=1920,1080']
  })
  let page = await browser.newPage()

  await page.goto('http://localhost/sider/annet/tingrang/')

  const h2 = await page.$eval('h2', e => e.innerHTML)
  expect(h2).toBe('Choose list')

  browser.close()
})