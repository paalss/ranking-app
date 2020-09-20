/*
// Unit Test
const { findFreeLiId } = require('./script')
test('Able to find a free nubmer?', () => {
  expect(findFreeLiId()).not.toBeNaN()
})
*/

// End to end test
const puppeteer = require('puppeteer')

test('if h2 and a tag exists', async () => {
  let browser = await puppeteer.launch()
  let page = await browser.newPage()

  await page.goto('http://localhost/sider/annet/tingrang/')

  const h2 = await page.$eval('h2', e => e.innerHTML)
  expect(h2).toBe('Choose list')

  const aTags = await page.$$eval('a', e => e.map(element => element.innerHTML))
  expect(aTags[0]).toBe('games')
  expect(aTags[1]).toBe('music')

  browser.close()
})