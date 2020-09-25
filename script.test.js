const puppeteer = require('puppeteer')

let browser
let page

// jest.setTimeout(10000);

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

test('if a list item exists', async () => {
  // await page.goto('http://localhost/sider/annet/tingrang/')
  // Click first link
  await page.click('a')

  const h2 = await page.$eval('h2', e => e.innerHTML)
  expect(h2).toEqual(expect.stringContaining('List:'))

  // selector(#\\31 ) = selecting element by id "1".
  const titleById1 = await page.$eval('#\\31  .title', e => e.innerHTML)
  expect(titleById1).not.toBe(null)
})

test('if first item can move down', async () => {
  // await page.goto('http://localhost/sider/annet/tingrang/list.html?list=games')
  const titles = await page.$$eval('.title', e => e.map(e => e.innerHTML))

  await page.click('#\\31  .move-element-down-button')
  const titlesAfterMoveElementDown = await page.$$eval('.title', e => e.map(e => e.innerHTML))

  expect(titlesAfterMoveElementDown[0]).toBe(titles[1])
  expect(titlesAfterMoveElementDown[1]).toBe(titles[0])
  
  await page.click('#\\31  .move-element-up-button')
  const titlesAfterMoveElementUp = await page.$$eval('.title', e => e.map(e => e.innerHTML))
  expect(titlesAfterMoveElementUp[0]).toBe(titles[0])
}, 10000)

test('if first item can be edited', async () => {
  // await page.goto('http://localhost/sider/annet/tingrang/list.html?list=games')
  await page.click('#\\31  .toggle-editing-mode-button')
  
  // Expect element by class title to be in editing mode, and not in normal mode
  const titlesInEditingMode = await page.$$eval('.title', e => e.map(e => e.tagName))
  expect(titlesInEditingMode[0]).toBe('INPUT')
  expect(titlesInEditingMode[0]).not.toBe('SPAN')

  // Type in the input
  await page.type('#\\31  .title', 'Change')

  // Expect it to contain the string 'Change'
  const changedTitle = await page.$eval('#\\31  .title', e => e.value)
  expect(changedTitle).toEqual(expect.stringContaining('Change'))
}, 10000)

afterAll(async () => {
  browser.close()
})



// page.reload
// page.screenshot