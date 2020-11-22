'use strict'

window.onload = () => {
  // Determine which is open
  const pageAddress = window.location.search
  if (pageAddress == '') {
    var page = 'index'
  } else { // pageAddress == " ?list=x"
    var page = 'list'
  }

  if (page == 'index') {
    composeList(page)
    addClickListenerToHeaderButtons(page, '', '')
  } else {
    const GETparameter = window.location.search.substr(1) // eg. list=1, list=2
    const listId = GETparameter.substring(GETparameter.indexOf('=') + 1) // eg. 1, 2
    fetch('php/findLists.php')
      .then(res => res.json())
      .then(lists => { // eg. Array [ (2) […], (2) […] ] -> 0: Array [ "1", "books" ]
        var arrayIndex = 0
        lists.forEach(listInfo => {
          if (listInfo[0] == listId) {
            const listName = listInfo[1]
            setTitle(listName)
          } else {
            arrayIndex++
          }
        })
      })
    composeList(page, listId)
    addClickListenerToHeaderButtons(page, GETparameter, listId)
  }

}

function setTitle(listName) {
  const h2 = document.querySelector('h2')
  h2.innerHTML = 'List: ' + listName
}

async function composeList(page, listId) {
  if (page == 'index') {
    fetch('php/findLists.php')
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          const id = item[0]
          const title = item[1]
          composeItem(page, id, '', title)
        })
      });
  } else {
    const infoForPhp = { POSTValue: listId }
    const data = await fetchFileAndPostData('php/findListItems.php', infoForPhp)
    data.forEach(item => {
      const id = item[0]
      const listId = item[1]
      const title = item[3]
      const artist = item[4]
      const image = item[5]

      composeItem(page, id, listId, title, artist, image)
    })
  }
  setSaveButtonTextTo('&check; Saved')
}

function composeItem(page, id, listId, title, artist, image) {
  const li = document.createElement('li')
  const list = document.getElementById('active-list')
  list.appendChild(li)

  if (page == 'index') {
    li.outerHTML = `
      <li id="${id}">
        <form class="edit-item">
          <button class="wide round-button title" id="${id}">${title}</button>
          <button class="transparent-bg-button toggle-editing-mode-button">Edit title</button>
        </form>
      </li>
    `
    addClickListenerToListItemButtons(page, id)
  } else {
    li.outerHTML = `
      <li id="${id}">
        <div class="flex-row">
          <div class="image">
            <img src="images/${image}" alt="${image}">
          </div>
          <form class="edit-item">
            <div class="text-width">
              <span id="title" class="title">${title}</span><br>
              <span id="artist" class="artist">${artist}</span>
            </div>
            <button class="round-button toggle-editing-mode-button">Edit</button>
          </form>
          <button class="round-button delete-item-button">Delete</button>
          <button class="round-button move-item-up-button"><div class="arrow-up"></div></button>
          <button class="round-button move-item-down-button"><div class="arrow-down"></div></button>
        </div>
      </li>
    `
    addClickListenerToListItemButtons(page, id, listId)
  }
  formEditLiPreventDefault(id)

}

/**
 * Add click event listeners to header buttons
 * @param {string} GETparameter 'list=___'
 */
function addClickListenerToHeaderButtons(page, GETparameter, listId) {
  if (page == 'index') {
    document.getElementById('create-item-button').addEventListener('click', () => createItem(page, '', '', '', ''))
    document.getElementById('save-button').addEventListener('click', () => saveList(page))
  } else {
    document.getElementById('create-item-button').addEventListener('click', () => createItem(page, listId, 'default.png', '', ''))
    document.getElementById('return-home-button').addEventListener('click', () => returnHome(page))
    document.getElementById('save-button').addEventListener('click', () => saveList(page, listId))
    document.getElementById('refresh-button').addEventListener('click', () => window.location = 'list.html?' + GETparameter)
  }
}

/**
 * Add click event listeners to list item buttons
 * @param {number} id list item ID
 */
function addClickListenerToListItemButtons(page, id, listId) {
  const item = document.getElementById(id)
  if (page == 'index') {
    item.querySelector('.title').addEventListener('click', () => goToList(page, id))
    item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(page, id))
  } else {
    item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(page, id, listId))
    item.querySelector('.delete-item-button').addEventListener('click', () => deleteItem(page, id, listId))
    item.querySelector('.move-item-up-button').addEventListener('click', () => moveItem(page, id, 'up', listId))
    item.querySelector('.move-item-down-button').addEventListener('click', () => moveItem(page, id, 'down', listId))
  }
}

async function createItem(page, listId, image, title, artist) {
  const id = await findFreeLiId(page)
  if (page == 'index') {
    composeItem(page, id, '', title)
    toggleEditingMode(page, id) // turn on editing mode for this item
  } else {
    composeItem(page, id, listId, title, artist, image)
    toggleEditingMode(page, id, listId) // turn on editing mode for this item
    determineSaveButtonText(page, listId)
  }
}

function highlight(item) {
  item.style.transition = 'background-color 0ms linear'
  item.style.backgroundColor = 'rgb(34, 34, 34)'
  setTimeout(() => {
    item.style.transition = 'background-color 500ms linear'
    item.style.backgroundColor = ''
  }, 500);
}

/**
 * Move list item in a direction
 * @param {number} liNo 
 * @param {string} direction
 */
function moveItem(page, liNo, direction, listId) {
  const itemToMove = document.getElementById(liNo)
  const ol = document.getElementById('active-list')
  if (direction == 'up') {
    /* Move chosen item up
    as long as it's not at the top of the list */
    const element = itemToMove
    const previousElement = itemToMove.previousElementSibling
    if (previousElement != null) {
      ol.insertBefore(element, previousElement)
    }
  } else {
    /* Move chosen item down
    as long as it's not at the bottom of the list  */
    const element = itemToMove
    const nextElement = itemToMove.nextElementSibling
    if (nextElement != null) {
      ol.insertBefore(nextElement, element)
    }
  }
  highlight(itemToMove)
  determineSaveButtonText(page, listId)
}

/**
 * Items will have to move to a different list
 * before it can be removed completely. This list is
 * for telling the database which records it should delete
 * when it syncs to your GUI list.
 */
function deleteItem(page, liNo, listId) {
  const itemToTrash = document.getElementById(liNo)
  const trashedItems = document.getElementById('trash-list')
  trashedItems.appendChild(itemToTrash)

  determineSaveButtonText(page, listId)
}

function toggleEditingMode(page, id, listId) {
  const item = document.getElementById(id)

  // if editing mode is open, close it
  if (item.classList.contains('editing-mode')) {
    item.classList.remove('editing-mode')

    const divEditItem = item.querySelector('.edit-item')
    const title = item.querySelector('.title').value

    if (page == 'index') {
      divEditItem.innerHTML = `
          <button class="wide round-button title" id="${id}">${title}</button>
          <button class="transparent-bg-button toggle-editing-mode-button">Edit title</button>
      `
      divEditItem.querySelector('.title').addEventListener('click', () => goToList(page, id))
      divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(page, id))
      determineSaveButtonText(page)
    } else {
      const artist = item.querySelector('.artist').value
      const divImage = item.querySelector('.image')
      const imageSourcePath = item.querySelector('img').src
      const imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)

      divImage.innerHTML = `
        <img src="images/${imageFilename}" alt="${imageFilename}">
      `

      divEditItem.innerHTML = `
        <div class="text-width">
          <span id="title" class="title">${title}</span><br>
          <span id="artist" class="artist">${artist}</span>
        </div>
        <button class="round-button toggle-editing-mode-button">Edit</button>
      `
      divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(page, id, listId))
      const imageUploadInputs = item.querySelector('.image-upload-inputs')
      item.removeChild(imageUploadInputs)
      determineSaveButtonText(page, listId)
    }
  } else { // If editing mode is closed, open it
    item.classList.add('editing-mode')

    const divEditItem = item.querySelector('.edit-item')
    const title = item.querySelector('.title').innerHTML
    if (page == 'index') {
      divEditItem.innerHTML = `
        <input class="title" type="text" placeholder="title" value="${title}">
        <button class="round-button toggle-editing-mode-button">Close edit</button>
      `
      divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(page, id))
      divEditItem.querySelector('.title').addEventListener('input', () => determineSaveButtonText(page))
    } else {
      const artist = item.querySelector('.artist').innerHTML
      const divImage = item.querySelector('.image')
      const imageSourcePath = item.querySelector('img').src
      const imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)

      divImage.innerHTML = `
        <img src="images/${imageFilename}" alt="${imageFilename}">
      `
      divEditItem.innerHTML = `
        <div class="text-width">
          <input class="title" type="text" placeholder="title" value="${title}"><br>
          <input class="artist" type="text" placeholder="artist" value="${artist}">
        </div>
        <button class="round-button toggle-editing-mode-button">Close edit</button>
      `
      divEditItem.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(page, id, listId))
      divEditItem.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => determineSaveButtonText(page, listId))
      })

      const imageUploadInputs = document.createElement('div')
      imageUploadInputs.classList.add('image-upload-inputs')
      item.appendChild(imageUploadInputs)

      imageUploadInputs.innerHTML = `
        <form class="image-upload" name="image-upload" method="post" enctype="multipart/form-data">
          upload image
          <input type="file" class="upload-file" name="upload-file"><br>
          <input type="submit" value="Upload image">
        </form>
      `
      // Ready image upload form
      const formImageUpload = item.querySelector('.image-upload')
      formImageUpload.addEventListener('submit', (event) => {
        event.preventDefault()
        const formattedFormData = new FormData(formImageUpload)
        downloadImage(formattedFormData, id)
      })

    }
    const inputTitle = item.querySelector('.title')
    inputTitle.focus()
  }
}

function formEditLiPreventDefault(liNo) {
  const item = document.getElementById(liNo)
  const form = item.querySelector('.edit-item')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
  })
}

async function fetchFileAndPostData(fileToFetch, valuesToPost) {
  const response = await fetch(fileToFetch, {
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    body: formEncode(valuesToPost)
  })
  return await response.json()
}

/**
 * Ask PHP to download image into folder,
 * once it's done, place image in list item
 */
async function downloadImage(formattedFormData, liNo) {
  console.log('formattedFormData: ', formattedFormData)
  console.log('typeof formattedFormData: ', typeof formattedFormData)
  // PHP attempts to download image
  const response = await fetch('php/placeImgInFolder.php', {
    method: 'POST',
    body: formattedFormData
  })
  // PHP provides feedback about image download attempt
  const data = await response.text()

  if (data == 'did_not_upload') {
    var imgUploaded = false
  }
  else if (data == 'was_not_downloaded') {
    var imgUploaded = 'wrong'
    alert('Bilde ble ikke lastet ned')
  }
  else if (data == 'was_downloaded') {
    var imgUploaded = true
  }

  if (imgUploaded == true) {
    // Insert image
    const imageFilename = document.forms['image-upload']['upload-file'].files[0].name
    const item = document.getElementById(liNo)
    const divImage = item.querySelector('.image')

    divImage.innerHTML = `
      <img src="images/${imageFilename}" alt="${imageFilename}">
    `
  }

}

/**
 * Finds an ID in which isn't already in use.
 * Neither by any item in the database, nor on any unsaved local item
 * Function is called as a parameter in createItem()
 */
async function findFreeLiId(page) {
  // Fetch item Ids from the database
  if (page == 'index') {
    var response = await fetch('php/findAllListsId.php')
  } else {
    var response = await fetch('php/findAllListItemsId.php')
  }
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json() // eg. Array(6) [ (1) […], (1) […], (1) […], (1) […], (1) […], (1) […] ] -> 0: Array [ "1" ]
  const flatData = data.flat(1) // eg. Array(6) [ "1", "2", "11", "3", "4", "5", "9" ]

  // Fetch items from GUI, and add their id to the flatData list
  const unsavedItemIdsNodeList = document.querySelectorAll('li')
  const unsavedItemIds = [...unsavedItemIdsNodeList]
  unsavedItemIds.forEach(element => {
    flatData.push(element.id)
  }) // Array(10) [ "1", "2", "11", "3", "4", "5", "9", "4", "2", "3", "5" ]

  // Prepare array for looping
  const removedDuplicateData = [...new Set(flatData)] // eg. Array(7) [ "1", "2", "11", "3", "4", "5", "9" ]
  const sortData = removedDuplicateData
  sortData.sort((a, b) => a - b) // Array(7) [ "1", "2", "3", "4", "5", "9", "11" ]

  const handledData = sortData

  /* Counter: Counting from 1 and upwards. handledData: A list of ids ascending ordered.
  If there's a count number that doesn't match the id, no id is using that number and it's free to use.
  The Id list may not have such "holes", but it will in either case run out of entries eventually. */

  let counter = 1
  var freeLiId
  for (let i = 0; i < handledData.length + 1; i++) {
    if (handledData[i] == undefined) {
      freeLiId = counter
      return freeLiId
    }
    else if (counter != handledData[i]) {
      freeLiId = counter
      return freeLiId
    }
    else {
      counter++
    }
  }
}

async function saveList(page, listId) {
  /* Make sure no list item is in editing mode
  saveList function isn't built for list items being in this mode */
  ensureNoEditingModeIsOpen(page, listId)

  // Update database with any new data
  const listAsArray = convertListToArray(page, 'active-list')
  if (page == 'index') {
    var itemNo = 0
    listAsArray.forEach(itemAsArray => {
      itemNo++
      let infoForPhp = { updatedItem: itemAsArray }
      const data = fetchFileAndPostData('php/updateList.php', infoForPhp)
      if (!data) {
        console.warn('saveList updating: ', data)
      }
    })
  } else { // page == 'list'
    var itemNo = 0
    listAsArray.forEach(itemAsArray => {
      itemNo++
      let infoForPhp = { updatedItem: itemAsArray, place: itemNo, listId: listId }
      const data = fetchFileAndPostData('php/updateListItem.php', infoForPhp)
      if (!data) {
        console.warn('saveList updating: ', data)
      }
    })
  }

  // Delete database records that corresponds to our trash list
  const trashListAsArray = convertListToArray(page, 'trash-list')
  if (page == 'index') {
    trashListAsArray.forEach(deletedItemAsArray => {
      let infoForPhp = { deletedItem: deletedItemAsArray }
      const data = fetchFileAndPostData('php/deleteList.php', infoForPhp)
    })
  } else {
    trashListAsArray.forEach(deletedItemAsArray => {
      let infoForPhp = { deletedItem: deletedItemAsArray }
      const data = fetchFileAndPostData('php/deleteListItem.php', infoForPhp)
    })
  }

  setSaveButtonTextTo('&check; Saved')
}

/**
 * Make sure no list item is in editing mode
 */
function ensureNoEditingModeIsOpen(page, listId) {
  const itemsWithEditingMode = document.getElementsByClassName('editing-mode')
  if (itemsWithEditingMode.length > 0) {
    /* itemsWithEditingMode (HTMLCollection) automatically updates when the underlying document is changed.
    To avoid this, make a copy array we can loop through and change the DOM */
    const itemsReference = [...itemsWithEditingMode]

    itemsReference.forEach(item => {
      toggleEditingMode(page, item.id, listId)
    });
  }
}

/**
 * Determines what text saveButton should have.
 * Checks for unsaved changes and gives appropriate feedback
 */
async function determineSaveButtonText(page, listId) {
  const currentListAsArray = convertListToArray(page, 'active-list') // eg. Array(3) [ (4) […], (4) […], (4) […] ] -> 0: Array(4) [ "37", "fear is the key", "alistair maclean", … ]

  if (page == 'index') {
    const infoForPhp = { POSTValue: listId }
    const data = await fetchFileAndPostData('php/findLists.php', infoForPhp)
    data.forEach(element => {
      element.splice(1, 2)
    })

    const lastSavedListAsArray = data

    if (JSON.stringify(currentListAsArray) == JSON.stringify(lastSavedListAsArray)) {
      setSaveButtonTextTo('&check; Saved')
    } else {
      setSaveButtonTextTo('● Save lists')
    }
  } else {
    const infoForPhp = { POSTValue: listId }
    const data = await fetchFileAndPostData('php/findListItems.php', infoForPhp)
    // data eg.: Array(3) [ (6) […], (6) […], (6) […] ] -> 0: Array(6) [ "37", "1", "1", … ]
    data.forEach(element => {
      element.splice(1, 2)
    })
    // data eg.: Array(3) [ (4) […], (4) […], (4) […] ] -> 0: Array(4) [ "37", "fear is the key", "alistair maclean", … ]
    const lastSavedListAsArray = data

    if (JSON.stringify(currentListAsArray) == JSON.stringify(lastSavedListAsArray)) {
      setSaveButtonTextTo('&check; Saved')
    } else {
      setSaveButtonTextTo('● Save changes')
    }
  }
}

/**
 * Define the saveButton's text
 */
function setSaveButtonTextTo(text) {
  const saveButton = document.getElementById('save-button')
  saveButton.innerHTML = text
}

/**
 * Convert chosen list to array
 * @param {string} activeListOrTrashList list type. Either
 * the list main list 'active-list', or the list with all
 * the trashed list items
 */
function convertListToArray(page, activeListOrTrashList) {
  const listAsArray = []
  const listType = document.getElementById(activeListOrTrashList)
  const listItems = listType.querySelectorAll('li')

  /* For each list item, find its different values,
  and build the text string */
  for (let i = 0; i < listItems.length; i++) {
    let id = listItems[i].id
    let title = listItems[i].querySelector('.title').innerHTML
    if (page == 'index') {
      var itemAsArray = [id, title]
    } else {
      let artist = listItems[i].querySelector('.artist').innerHTML
      let imageSourcePath = listItems[i].querySelector('img').src
      let imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)
      var itemAsArray = [id, title, artist, imageFilename]
    }
    listAsArray.push(itemAsArray)
  }
  return listAsArray
}

function goToList(page, listId) {
  const isSaved = document.getElementById('save-button').innerHTML
  if (isSaved != '✓ Saved') {
    const willRemoveChanges = confirm('Leaving this page will remove unsaved changes, continue?')
    if (willRemoveChanges == true) {
      window.location = `list.html?list=${listId}`
    }
  } else {
    window.location = `list.html?list=${listId}`
  }
}

function returnHome(page) {
  const isSaved = document.getElementById('save-button').innerHTML
  if (isSaved != '✓ Saved') {
    const willRemoveChanges = confirm('Leaving this page will remove unsaved changes, continue?')
    if (willRemoveChanges == true) {
      window.location = 'index.html'
    }
  } else {
    window.location = 'index.html'
  }
}

/**
 * A Function for helping with sending values to PHP, without the user is providing any user input.
 * Code's made by Anders_bondehagen on
 * https://forums.fusetools.com/t/how-do-i-receive-post-data-in-php-sent-from-fuse-javascript-by-fetch/5357/3
 * NB. This converts any array into csv based string
 */
function formEncode(obj) {
  var str = []
  for (var p in obj) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
  }
  return str.join("&")
}

// Export for unit testing
// exports.function = function