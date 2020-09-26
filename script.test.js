const puppeteer = require('puppeteer')
let browser, page

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 0
  })
  page = await browser.newPage()
  await page.goto('http://localhost/sider/annet/tingrang/')
  // await page.goto('http://localhost/sider/annet/tingrang/list.html?list=games')
})

test('if h2 and a-tags exists', async () => {
  const h2 = await page.$eval('h2', e => e.innerHTML)
  expect(h2).toBe('Choose list')

  let aTags = await page.$$eval('a', e => e.map(element => element.innerHTML))

  /* A-tags might not have been rendered yet. If undefined is returned, wait and check again
  proceed after the a-tags has been rendered, or after 5 tries */
  var counter = 0
  while (aTags == undefined && counter <= 5) {
    wait(1000)
    aTags = await page.$$eval('a', e => e.map(element => element.innerHTML))
    counter++
  }
  if (counter >= 1) {
    console.log('had to wait and check ' + counter + ' times to get a-tags')
  }
  expect(aTags[0]).toBe('games')
  expect(aTags[1]).toBe('music')
})

test('if a list item exists', async () => {
  await page.click('a')

  let h2 = await page.$eval('h2', e => e.innerHTML)

  /* h2 title might not have been added yet. If h2 still is an empty string, wait and check again
  proceed after the h2 has been filled, or after 5 tries */
  var counter = 0
  while (h2 == "" && counter <= 5) {
    wait(1000)
    h2 = await page.$eval('h2', e => e.innerHTML)
    counter++
  }
  if (counter >= 1) {
    console.log('had to wait and check ' + counter + ' times to get h2')
  }
  expect(h2).toEqual(expect.stringContaining('List:'))

  // selector(#\\31 ) = selecting element by id "1".
  const titleById1 = await page.$eval('#\\31  .title', e => e.innerHTML)
  expect(titleById1).not.toBe(null)
})

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

test('if first item can move down', async () => {
  const titles = await page.$$eval('.title', e => e.map(e => e.innerHTML))

  await page.click('#\\31  .move-element-down-button')
  const titlesAfterMoveElementDown = await page.$$eval('.title', e => e.map(e => e.innerHTML))
  expect(titlesAfterMoveElementDown[0]).toBe(titles[1])
  expect(titlesAfterMoveElementDown[1]).toBe(titles[0])

  await page.click('#\\31  .move-element-up-button')
  const titlesAfterMoveElementUp = await page.$$eval('.title', e => e.map(e => e.innerHTML))
  expect(titlesAfterMoveElementUp[0]).toBe(titles[0])
})

test('if first item can be edited', async () => {
  await page.click('#\\31  .toggle-editing-mode-button')

  // Expect element by class title to be in editing mode, and not in normal mode
  const titlesInEditingMode = await page.$$eval('.title', e => e.map(e => e.tagName))
  expect(titlesInEditingMode[0]).toBe('INPUT')
  expect(titlesInEditingMode[0]).not.toBe('SPAN')

  // Type in the input and close editing mode
  await page.type('#\\31  .title', 'Change')
  await page.click('#\\31  .toggle-editing-mode-button')
  // Expect it to contain the string 'Change'
  const changedTitle = await page.$eval('#\\31  .title', e => e.innerHTML)
  expect(changedTitle).toEqual(expect.stringContaining('Change'))
})

test('if user can add element', async () => {
  // List items pre to button click
  const preLis = await page.$$eval('li', e => e.map(e => e.tagName))
  const preLisAmount = preLis.length

  await page.click('#create-element-button')

  // List items post to button click
  const postLis = await page.$$eval('li', e => e.map(e => e.tagName))
  const postLisAmount = postLis.length

  // Expect current amount of list items to be 1 more than before
  expect(postLisAmount).toBe(preLisAmount+1)
})

afterAll(async () => {
  browser.close()
})



// page.reload
// page.screenshot