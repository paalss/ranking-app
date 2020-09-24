/*
// Unit Test
const { findFreeLiId } = require('./script')
test('Able to find a free nubmer?', () => {
expect(findFreeLiId()).not.toBeNaN()
})
*/

// End to end test
const puppeteer = require('puppeteer')

test('if h2 and a-tags exists', async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost/sider/annet/tingrang/')

  const h2 = await page.$eval('h2', e => e.innerHTML)
  expect(h2).toBe('Choose list')

  const aTags = await page.$$eval('a', e => e.map(element => element.innerHTML))
  expect(aTags[0]).toBe('games')
  expect(aTags[1]).toBe('music')

  browser.close()
})

test('if lists exists', async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250 // slow down by 250ms
  });
  const page = await browser.newPage()

  await page.goto('http://localhost/sider/annet/tingrang/')

  // Click first link
  await page.click('a')

  const titles = await page.$$eval('.title', e => e.map(element => element.innerHTML))
  expect(titles[0]).toBe('Hollow Knight: Silksong')
  expect(titles[1]).toBe('Noita')

  browser.close()
}, 7000)

