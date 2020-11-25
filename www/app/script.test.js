// Run `npm install` in this directory to install jest

const puppeteer = require('puppeteer')
let browser, page
const appPath = 'http://localhost/app/'
// const appPath = 'http://localhost/app/list.html?list=1'

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 0
  })
  page = await browser.newPage()
  await page.goto(appPath)
})


test('if h2 and a-tag exists', async () => {
  const h2 = await page.$eval('h2', e => e.innerHTML)
  expect(h2).toBe('Choose list')

  // Wait until JS has added this content to the page
  await page.waitForSelector('#active-list button')
  let button = await page.$eval('#active-list button', e => e.tagName)
  expect(button).toBe('BUTTON')
})


test('if a list item exists', async () => {
  await page.click('#active-list button')

  // Wait until JS has added this content to the page
  await page.waitForSelector('.title')

  const titleById1 = await page.$eval('.title', e => e.innerHTML)
  expect(titleById1).not.toBe(null)
}, 8000)


test('if first item can move down', async () => {
  // See how the list looks like pre to moving item
  const preMovedlis = await page.$$eval('.title', e => e.map(e => e.innerHTML))

  // Attempt to move an item down and see how the list looks like post moving.
  await page.click('.move-item-down-button')
  const postMovedLis = await page.$$eval('.title', e => e.map(e => e.innerHTML))

  // If moved sucsessfully, the second item in post list should be the same as the first item in pre list
  expect(postMovedLis[1]).toBe(preMovedlis[0])
  expect(postMovedLis[0]).toBe(preMovedlis[1])

  // Move item back up
  await page.click('li:nth-child(2) .move-item-up-button')
  const postMovedBackLis = await page.$$eval('.title', e => e.map(e => e.innerHTML))

  // Expect it to be like it was before moves
  expect(postMovedBackLis[0]).toBe(preMovedlis[0])
}, 8000)


test('if first item can be edited', async () => {
  await page.click('.toggle-editing-mode-button')

  // Expect item by class title to be in editing mode, and not in normal mode
  const titlesInEditingMode = await page.$$eval('.title', e => e.map(e => e.tagName))
  expect(titlesInEditingMode[0]).toBe('INPUT')
  expect(titlesInEditingMode[0]).not.toBe('SPAN')

  // Type in the input and close editing mode
  await page.type('.title', 'Change')
  await page.click('.toggle-editing-mode-button')
  const changedTitle = await page.$eval('.title', e => e.innerHTML)

  // Expect it to contain the string 'Change'
  expect(changedTitle).toEqual(expect.stringContaining('Change'))
}, 8000)


test('if user can create item', async () => {
  // See items pre to button click, and count items
  const preCreatedLis = await page.$$eval('li', e => e.map(e => e.tagName))
  console.log('preCreatedLis.length (expected): ', preCreatedLis.length)
  await page.click('#create-item-button')
  await page.waitFor(1000)

  // See items post to button click, and count items
  const postCreatedLis = await page.$$eval('li', e => e.map(e => e.tagName))
  console.log('postCreatedLis.length (received): ', postCreatedLis.length)
  // If created sucsessfully, the amount of current items should be 1 more than before
  expect(postCreatedLis.length).toBe(preCreatedLis.length + 1)
}, 7000)


test('if list can be saved', async () => {
  /* This test uses the saving function, we don't want to keep any of the
   previous changes, therefore, run a page reload. */
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })

  // See how list looks like pre to saving
  const preSavedLis = await page.$$eval('li .title', e => e.map(e => e.innerHTML))

  // Make a change, hit save and see how the list looks like after saving
  await page.click('.move-item-down-button')
  await page.click('#save-button')
  const postSavedLis = await page.$$eval('li .title', e => e.map(e => e.innerHTML))

  // Page refresh. Resets any unsaved changes
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })

  const currentLis = await page.$$eval('li .title', e => e.map(e => e.innerHTML))

  // If saving worked, the current list should look like it was when saving
  expect(currentLis).toEqual(postSavedLis)
  expect(currentLis).not.toEqual(preSavedLis)

  // Move the item by id 2 back up
  await page.click('li:nth-child(2) .move-item-up-button')
  await page.click('#save-button')

  // If saving worked, the current list should look like it was when saving
  const currentLis2 = await page.$$eval('li .title', e => e.map(e => e.innerHTML))

  expect(currentLis2).toEqual(preSavedLis)
}, 9000)


afterAll(async () => {
  browser.close()
})

