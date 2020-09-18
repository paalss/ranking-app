'use strict'

window.onload = () => {
  const GETparameter = window.location.search.substr(1)
  const listName = GETparameter.substring(GETparameter.indexOf('=') + 1)
  setTitle(listName)
  createList(listName)
  addClickListenerToButtons(GETparameter, listName)
}

function setTitle(listName) {
  const h2 = document.querySelector('h2')
  h2.innerHTML = 'List: ' + listName
}

function createList(listName) {
  /* Make sure to receive the list from the file
  and not from a cached file. The user may have made some changes to
  the file after it was uploaded to cache. Therefore, ignore cache. */
  var myHeaders = new Headers()
  myHeaders.append('pragma', 'no-cache')
  myHeaders.append('cache-control', 'no-cache')

  var myInit = {
    method: 'GET',
    headers: myHeaders,
  }

  var myRequest = new Request(`lists/${listName}.txt`)

  // Generate GUI list from text file
  fetch(myRequest, myInit)
    .then(res => res.text())
    .then(data => {
      // The text file contains multiple lines where each shall be a list item
      let array = data.split('\n')
      var liNo = 0
      array.forEach(element => {
        liNo++
        // The text lines contains comma separated values
        let data = element.split(', ')

        let image = data[2]
        let title = data[0]
        let artist = data[1]

        createElement(image, title, artist, liNo)
      });
    })
  setSaveButtonTextTo('&check; Saved')
}

function createElement(image, title, artist, liNo) {
  const orderedList = document.getElementById('ordered-list')
  const li = document.createElement('li')
  orderedList.appendChild(li)

  // Create list item and its contents
  li.outerHTML = `
    <li id="${liNo}">
      <div class="flex-row">
        <div class="image">
          <img src="images/${image}" alt="${image}">
        </div>
        <form class="edit-li">
          <div class="text-width">
            <span id="title" class="title">${title}</span><br>
            <span id="artist" class="artist">${artist}</span>
          </div>
          <button class="round-button toggle-editing-mode-button">Edit element</button>
        </form>
        <button class="round-button delete-element-button">Delete</button>
        <button class="round-button move-element-up-button"><div class="arrow-up"></div></button>
        <button class="round-button move-element-down-button"><div class="arrow-down"></div></button>
      </div>
    </li>
  `
  formEditLiPreventDefault(liNo)
  addClickListenerToListItemButtons(liNo)
}

/**
 * Add click event listeners to header buttons
 * @param {string} GETparameter 'list=___'
 */
function addClickListenerToButtons(GETparameter, listName) {
  document.getElementById('return-home-button').addEventListener('click', () => window.location = 'index.html')
  document.getElementById('create-element-button').addEventListener('click', () => userCreateElement('default.png', '', '', findFreeLiId()))
  document.getElementById('save-button').addEventListener('click', () => saveList(listName))
  document.getElementById('refresh-button').addEventListener('click', () => window.location = 'list.html?' + GETparameter)
}

/**
 * Add click event listeners to list item buttons
 * @param {number} liNo list item ID
 */
function addClickListenerToListItemButtons(liNo) {
  const item = document.getElementById(liNo)
  item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(liNo))
  item.querySelector('.delete-element-button').addEventListener('click', () => deleteElement(liNo))
  item.querySelector('.move-element-up-button').addEventListener('click', () => moveElement(liNo, 'up'))
  item.querySelector('.move-element-down-button').addEventListener('click', () => moveElement(liNo, 'down'))
}

function userCreateElement(image, title, artist, liNo) {
  createElement(image, title, artist, liNo)
  toggleEditingMode(liNo)
  determineSaveButtonText()
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
 * Move chosen element in a direction
 * @param {number} liNo 
 * @param {string} direction 
 */
function moveElement(liNo, direction) {
  const itemToMove = document.getElementById(liNo)
  const ol = document.getElementById('ordered-list')
  if (direction == 'up') {
    /* Move chosen element up
    as long as it's not at the top of the list */
    const element = itemToMove
    const previousElement = itemToMove.previousElementSibling
    if (previousElement != null) {
      ol.insertBefore(element, previousElement)
    }
  } else {
    /* Move chosen element down
    as long as it's not at the bottom of the list  */
    const element = itemToMove
    const nextElement = itemToMove.nextElementSibling
    if (nextElement != null) {
      ol.insertBefore(nextElement, element)
    }
  }
  highlight(itemToMove)
  determineSaveButtonText()
}

function deleteElement(liNo) {
  const itemToDelete = document.getElementById(liNo)
  const ol = document.getElementById('ordered-list')
  ol.removeChild(itemToDelete)
  determineSaveButtonText()
}

function toggleEditingMode(liNo) {
  const item = document.getElementById(liNo)
  const divImage = item.querySelector('.image')
  const divEditLi = item.querySelector('.edit-li')

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
      <button class="round-button toggle-editing-mode-button">Edit element</button>
    `

    item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(liNo))

    const imageUploadInputs = item.querySelector('.image-upload-inputs')
    item.removeChild(imageUploadInputs)

    determineSaveButtonText()
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
        <input class="title" type="text" placeholder="title" oninput="determineSaveButtonText()" value="${title}"><br>
        <input class="artist" type="text" placeholder="artist" oninput="determineSaveButtonText()" value="${artist}">
      </div>
      <button class="round-button toggle-editing-mode-button">Close edit</button>
    `
    item.querySelector('.toggle-editing-mode-button').addEventListener('click', () => toggleEditingMode(liNo))

    const imageUploadInputs = document.createElement('div')
    imageUploadInputs.classList.add('image-upload-inputs')
    item.appendChild(imageUploadInputs)

    imageUploadInputs.innerHTML = `
      <form class="image-upload" name="image-upload" method="post" enctype="multipart/form-data">
        <input type="file" class="upload-file" name="upload-file"><br>
        <input type="submit" value="Upload">
      </form>
    `

    const inputTitle = item.querySelector('.title')
    inputTitle.focus()

    // Ready image upload form
    const formImageUpload = item.querySelector('.image-upload')
    formImageUpload.addEventListener('submit', (event) => {
      event.preventDefault()
      const formattedFormData = new FormData(formImageUpload)
      postData(formattedFormData, liNo)
    })
  }
}

function formEditLiPreventDefault(liNo) {
  const item = document.getElementById(liNo)
  const form = item.querySelector('.edit-li')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
  })
}

/**
 * Ask PHP to download image into folder,
 * once it's done, place image in list element
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
 * Executed as a parameter in userCreateElement
 */
function findFreeLiId() {
  let lis = document.querySelectorAll('li')
  for (let i = 1; i < lis.length + 2; i++) {
    let element = document.getElementById(i)
    if (element == null) {
      // No element has this as its ID, the ID's free to take
      return i
    }
  }
}

/**
 * Save the list to text file:
 * Convert the list to a text string,
 * and ask PHP to overwrite the existing file
 * @param {string} listName the name of the list-file. The file that holds the list.
 */
function saveList(listName) {
  /* Make sure no list item is in editing mode
  the code below isn't built for any list items being
  in editing mode */
  makeSureNoLiIsInEditingMode()

  let listAsTextString = ''
  listAsTextString = convertListToTextstring(listAsTextString)

  // We have list as text string, send this to PHP
  var infoForPhp = { newChange: listAsTextString, saveFile: listName + '.txt' }
  fetch(`updateFile.php`, {
    method: 'POST',
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: formEncode(infoForPhp)
  }).then(res => res.text())
    .then(data => {
      if (data != '') {
        alert(data)
      }
    })
  setSaveButtonTextTo('&check; Saved')
}

/**
 * Make sure no list item is in editing mode
 */
function makeSureNoLiIsInEditingMode() {
  const lisWithEditingMode = document.getElementsByClassName('editing-mode')

  if (lisWithEditingMode.length != 0) {
    // Lis with editing mode has been found

    let lisId_WithEditingMode = []
    // Loop through those lis and log their ID
    for (let i = 0; i < lisWithEditingMode.length; i++) {
      lisId_WithEditingMode.push(lisWithEditingMode[i].id)
    }

    /* With ID log of whichever lis are in editing mode, run toggleEditingMode to turn editing modes off
    This could not have been done in the previous loop, as it would mess with the HTML-colleciton */
    lisId_WithEditingMode.forEach(element => {
      toggleEditingMode(element)
    })
  }
}

/**
 * Determines what text saveButton should have.
 * Function first checks for unsaved changes in list and then
 * changes saveButton's text so it either shows '&check; saved' or '● Save changes'.
 */
function determineSaveButtonText() {
  var listAsTextString = ''
  listAsTextString = convertListToTextstring(listAsTextString)

  fetch('lists/music.txt')
    .then(res => res.text())
    .then(data => {
      var textFileAsTextString = data

      if (textFileAsTextString == listAsTextString) {
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

function convertListToTextstring(listAsTextString) {
  let lis = document.querySelectorAll('li')

  /* For each list item, find its different values,
  and build the text string */
  for (let i = 0; i < lis.length; i++) {
    let imageSourcePath = lis[i].querySelector('img').src
    let imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)
    let title = lis[i].querySelector('.title').innerHTML
    let artist = lis[i].querySelector('.artist').innerHTML
    let liAsTextString = title + ', ' + artist + ', ' + imageFilename
    if (i == 0) {
      // The first line in the text string, is the only one to not start with a new line
      listAsTextString += liAsTextString
    } else {
      listAsTextString += '\n' + liAsTextString
    }
  }
  return listAsTextString
}

/**
 * A Function for helping with sending values to PHP, without the user is providing any user input.
 * Code's made by Anders_bondehagen on
 * https://forums.fusetools.com/t/how-do-i-receive-post-data-in-php-sent-from-fuse-javascript-by-fetch/5357/3
 */
function formEncode(obj) {
  var str = []
  for (var p in obj) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
  }
  return str.join("&")
}