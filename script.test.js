const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 250
  })
  page = await browser.newPage()
  await page.goto('http://localhost/sider/annet/tingrang/')
})

test('if h2 and a-tags exists', async () => {
  // await page.goto('http://localhost/sider/annet/tingrang/')

  const h2 = await page.$eval('h2', e => e.innerHTML)
  expect(h2).toBe('Choose list')

  const aTags = await page.$$eval('a', e => e.map(element => element.innerHTML))
  expect(aTags[0]).toBe('games')
  expect(aTags[1]).toBe('music')

})

test('if list exists', async () => {
  // await page.goto('http://localhost/sider/annet/tingrang/')

  // Click first link
  await page.click('a')

  // Check if there's a list element with ID 1

  /* selector(#\\3X ) = selecting element by id "X".
  E.g. selecting item with id 2, will achieved by #\\32 */
  const titleById1 = await page.$eval('#\\31  .title', e => e.innerHTML)
  expect(titleById1).not.toBe(null)

}, 10000)

test('if first item can move down', async () => {
  // await page.goto('http://localhost/sider/annet/tingrang/list.html?list=games')

  const titles = await page.$$eval('.title', e => e.map(e => e.innerHTML))

  await page.click('#\\31  .move-element-down-button')

  const titlesAfterMoveElementDown = await page.$$eval('.title', e => e.map(e => e.innerHTML))
  expect(titlesAfterMoveElementDown[0]).toBe(titles[1])
  expect(titlesAfterMoveElementDown[1]).toBe(titles[0])
}, 10000)

afterAll(async () => {
  browser.close()
})