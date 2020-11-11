'use strict'

window.onload = () => {
  const GETparameter = window.location.search.substr(1) // list=1, list=2
  const listId = GETparameter.substring(GETparameter.indexOf('=') + 1) // 1, 2

  fetch('findLists.php')
    .then(res => res.json())
    .then(data => {
      const listName = data[listId - 1][1]
      setTitle(listName)
      composeList(listId)
      addClickListenerToButtons(GETparameter, listId)
    })
}

function setTitle(listName) {
  const h2 = document.querySelector('h2')
  h2.innerHTML = 'List: ' + listName
}

function composeList(listId) {
  const infoForPhp = { POSTValue: listId }
  fetch('findListItems.php', {
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    body: formEncode(infoForPhp)
  })
    .then(res => res.json())
    .then(data => {
      // var liNo = 0
      data.forEach(item => {
        // liNo++
        const id = item[0]
        const listId = item[1]
        // const place = item[2]
        const title = item[3]
        const artist = item[4]
        const image = item[5]

        composeItem(id, listId, title, artist, image)
      })
    })
  setSaveButtonTextTo('&check; Saved')
}

function composeItem(id, listId, title, artist, image) {
  const orderedList = document.getElementById('ordered-list')
  const li = document.createElement('li')
  orderedList.appendChild(li)

  // Create list item and its contents
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
  formEditLiPreventDefault(id)
  addClickListenerToListItemButtons(id, listId)
}

/**
 * Add click event listeners to header buttons
 * @param {string} GETparameter 'list=___'
 */
function addClickListenerToButtons(GETparameter, listId) {
  document.getElementById('return-home-button').addEventListener('click', () => window.location = 'index.html')
  document.getElementById('create-item-button').addEventListener('click', () => createItem(listId, 'default.png', '', ''))
  document.getElementById('save-button').addEventListener('click', () => saveList(listId))
  document.getElementById('refresh-button').addEventListener('click', () => window.location = 'list.html?' + GETparameter)
}

/**
 * Add click event listeners to list item buttons
 * @param {number} liNo list item ID
 */
function addClickListenerToListItemButtons(liNo, listId) {
  const item = document.getElementById(liNo)
  item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(liNo, listId))
  item.querySelector('.delete-item-button').addEventListener('click', () => deleteItem(liNo, listId))
  item.querySelector('.move-item-up-button').addEventListener('click', () => moveItem(liNo, 'up', listId))
  item.querySelector('.move-item-down-button').addEventListener('click', () => moveItem(liNo, 'down', listId))
}

async function createItem(listId, image, title, artist) {
  const id = await findFreeLiId()
  composeItem(id, listId, title, artist, image)
  toggleEditingMode(id, listId) // turn on editing mode for this item
  determineSaveButtonText(listId)
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
function moveItem(liNo, direction, listId) {
  const itemToMove = document.getElementById(liNo)
  const ol = document.getElementById('ordered-list')
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
  determineSaveButtonText(listId)
}

/**
 * Items will have to move to a different list
 * before it can be removed completely. This list is
 * for telling the database which records it should delete
 * when it syncs to your GUI list.
 */
function deleteItem(liNo, listId) {
  const itemToTrash = document.getElementById(liNo)
  const trashedItems = document.getElementById('delete-these-list-items')
  trashedItems.appendChild(itemToTrash)

  determineSaveButtonText(listId)
}

function toggleEditingMode(itemId, listId) {
  const item = document.getElementById(itemId)
  const divImage = item.querySelector('.image')
  const divEditLi = item.querySelector('.edit-item')

  if (item.classList.contains('editing-mode')) {
    item.classList.remove('editing-mode')

    const imageSourcePath = item.querySelector('img').src
    const imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)

    const title = item.querySelector('.title').value
    const artist = item.querySelector('.artist').value

    divImage.innerHTML = `
      <img src="images/${imageFilename}" alt="${imageFilename}">
    `

    divEditLi.innerHTML = `
      <div class="text-width">
        <span id="title" class="title">${title}</span><br>
        <span id="artist" class="artist">${artist}</span>
      </div>
      <button class="round-button toggle-editing-mode-button">Edit</button>
    `

    item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(itemId, listId))

    const imageUploadInputs = item.querySelector('.image-upload-inputs')
    item.removeChild(imageUploadInputs)

    determineSaveButtonText(listId)
  } else {
    item.classList.add('editing-mode')

    const imageSourcePath = item.querySelector('img').src
    const imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)

    const title = item.querySelector('.title').innerHTML
    const artist = item.querySelector('.artist').innerHTML

    divImage.innerHTML = `
      <img src="images/${imageFilename}" alt="${imageFilename}">
    `
    divEditLi.innerHTML = `
      <div class="text-width">
        <input class="title" type="text" placeholder="title" oninput="determineSaveButtonText(${listId})" value="${title}"><br>
        <input class="artist" type="text" placeholder="artist" oninput="determineSaveButtonText(${listId})" value="${artist}">
      </div>
      <button class="round-button toggle-editing-mode-button">Close edit</button>
    `
    item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(itemId, listId))

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

    const inputTitle = item.querySelector('.title')
    inputTitle.focus()

    // Ready image upload form
    const formImageUpload = item.querySelector('.image-upload')
    formImageUpload.addEventListener('submit', (event) => {
      event.preventDefault()
      const formattedFormData = new FormData(formImageUpload)
      postData(formattedFormData, itemId)
    })
  }
}

function formEditLiPreventDefault(liNo) {
  const item = document.getElementById(liNo)
  const form = item.querySelector('.edit-item')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
  })
}

/**
 * Ask PHP to download image into folder,
 * once it's done, place image in list item
 */
async function postData(formattedFormData, liNo) {
  // PHP attempts to download image
  const response = await fetch('placeImgInFolder.php', {
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
async function findFreeLiId() {
  // Fetch item Ids from the database
  const response = await fetch('findAllListItemsId.php')
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json() // eg. Array(6) [ (1) […], (1) […], (1) […], (1) […], (1) […], (1) […] ] -> 0: Array [ "1" ]
  const flatData = data.flat(1) // eg. Array(6) [ "1", "2", "11", "3", "4", "5", "9" ]

  // Fetch items from GUI, and add their id to the flatData list
  const unsavedItemIdsNodeList = document.querySelectorAll('li')
  const unsavedItemIds = [...unsavedItemIdsNodeList]
  unsavedItemIds.forEach(element=>{
    flatData.push(element.id)
  }) // Array(10) [ "1", "2", "11", "3", "4", "5", "9", "4", "2", "3", "5" ]
  
  // Prepare array for looping
  const removedDuplicateData = [...new Set(flatData)] // eg. Array(7) [ "1", "2", "11", "3", "4", "5", "9" ]
  
  const sortData = removedDuplicateData // Array(7) [ "1", "2", "3", "4", "5", "9", "11" ]
  sortData.sort((a,b)=>a-b)

  const handledData = sortData // Array(7) [ "1", "2", "3", "4", "5", "9", "11" ]
  console.log('handledData: ', handledData)
  /* Counter: Counting from 1 and upwards. handledData: A list of ids ordered from lowest to highest
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
      // console.log('handledData[i]: ', handledData[i])
      counter++
    }
  }
}

function saveList(listId) {
  /* Make sure no list item is in editing mode
  saveList function isn't built for list items being in this mode */
  ensureNoEditingModeIsOpen(listId)

  // Update database with any new data
  const listAsArray = convertListToArray('ordered-list')
  var itemNo = 0;
  listAsArray.forEach(itemAsArray => {
    itemNo++
    let infoForPhp = { updatedItem: itemAsArray, place: itemNo, listId: listId }
    fetch('updateListItem.php', {
      method: 'POST',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      body: formEncode(infoForPhp)
    })
      .then(res => res.text())
      .then(data => {
        if (!data) {
          console.warn('saveList updating: ', data)
        }
      })
      .catch(err => console.error('Caught error: ', err))
  })

  // Delete database records that corresponds to our trash list
  const trashListAsArray = convertListToArray('delete-these-list-items')
  trashListAsArray.forEach(deletedItemAsArray => {
    let infoForPhp = { deletedItem: deletedItemAsArray }
    fetch('deleteListItem.php', {
      method: 'POST',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      body: formEncode(infoForPhp)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => console.error('Caught error: ', err))
  })

  setSaveButtonTextTo('&check; Saved')
}

/**
 * Make sure no list item is in editing mode
 */
function ensureNoEditingModeIsOpen(listId) {
  const itemsWithEditingMode = document.getElementsByClassName('editing-mode')
  if (itemsWithEditingMode.length > 0) {
    /* itemsWithEditingMode (HTMLCollection) automatically updates when the underlying document is changed.
    To avoid this, make a copy array we can loop through and change the DOM */
    const itemsReference = [...itemsWithEditingMode]

    itemsReference.forEach(item => {
      toggleEditingMode(item.id, listId)
    });
  }
}

/**
 * Determines what text saveButton should have.
 * Checks for unsaved changes and gives appropriate feedback
 */
function determineSaveButtonText(listId) {
  const currentListAsArray = convertListToArray('ordered-list') // eg. Array(3) [ (4) […], (4) […], (4) […] ] -> 0: Array(4) [ "37", "fear is the key", "alistair maclean", … ]
  const infoForPhp = { POSTValue: listId }
  fetch('findListItems.php', {
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    body: formEncode(infoForPhp)
  })
    .then(res => res.json())
    .then(data => {
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
    })
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
 * the list main list 'ordered-list', or the list with all
 * the trashed list items
 */
function convertListToArray(activeListOrTrashList) {
  const listAsArray = []
  const listType = document.getElementById(activeListOrTrashList)
  const listItems = listType.querySelectorAll('li')

  /* For each list item, find its different values,
  and build the text string */
  for (let i = 0; i < listItems.length; i++) {
    let id = listItems[i].id
    let imageSourcePath = listItems[i].querySelector('img').src
    let imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)
    let title = listItems[i].querySelector('.title').innerHTML
    let artist = listItems[i].querySelector('.artist').innerHTML

    let itemAsArray = [id, title, artist, imageFilename]
    listAsArray.push(itemAsArray)
  }
  return listAsArray
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