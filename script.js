'use strict'

window.onload = () => {
  createList()
}

function createList() {
  // Generer GUI liste fra tekstfil
  fetch('spill.txt')
    .then(res => res.text())
    .then(data => {
      // Tekstfilen består av flere linjer som hver skal bli en <li>
      let array = data.split('\n')
      var liNo = 0
      array.forEach(spill => {
        liNo++
        // Tekstlinjene består av kommaseparerte verdier som hver skal behandles ulikt
        let spilldata = spill.split(', ')

        let image = spilldata[2]
        let title = spilldata[0]
        let artist = spilldata[1]

        createElement(image, title, artist, liNo)
      });
    })
}

function createElement(image, title, artist, liNo) {
  const orderedList = document.getElementById('ordered-list')
  const li = document.createElement('li')
  orderedList.appendChild(li)

  // Lag flexdiv innhold
  li.outerHTML = `
    <li id="${liNo}">
      <div class="flex-li">
        <div class="image">
          <img src="images/${image}" alt="${image}">
        </div>
        <form class="edit-li">
          <div class="text-width">
            <span id="title" class="title">${title}</span><br>
            <span id="artist" class="artist">${artist}</span>
          </div>
          <button class="round-button" onclick="toggleEditingMode(${liNo})">Endre</button>
        </form>
        <button class="round-button" onclick="deleteElement(${liNo})">Slett</button>
        <button class="round-button" onclick="moveElement(${liNo}, 'up')"><div class="arrow-up"></div></button>
        <button class="round-button" onclick="moveElement(${liNo}, 'down')"><div class="arrow-down"></div></button>
      </div>
    </li>
  `
  formEditLiPreventDefault(liNo)
}

function userCreateElement(image, title, artist, liNo) {
  createElement(image, title, artist, liNo)
  toggleEditingMode(liNo)
  checkIfListIsSaved()
}

/**
 * Gi en diskré highlight til elementet
 * som ble flyttet/endret
 * @param {element} item
 */
function highlight(item) {
  item.style.transition = 'background-color 0ms linear'
  item.style.backgroundColor = 'rgb(34, 34, 34)'
  setTimeout(() => {
    item.style.transition = 'background-color 500ms linear'
    item.style.backgroundColor = ''
  }, 500);
}

/**
 * Flytt valgt element i bestemt retning
 * @param {number} liNo 
 * @param {string} direction 
 */
function moveElement(liNo, direction) {
  // Hent elementet som skal flyttes
  const itemToMove = document.getElementById(liNo)
  const ol = document.getElementById('ordered-list')
  // Flytt elementet
  if (direction == 'up') {
    /* Flytt elementet foran forrige element.
    så lenge den ikke ligger øverst i listen */
    const element = itemToMove
    const previousElement = itemToMove.previousElementSibling
    if (previousElement != null) {
      ol.insertBefore(element, previousElement)
    }
  } else {
    /* Flytt valgt element under den neste i listen.
    så lenge den ikke ligger nederst i listen.
    Teknisk sett er det elementet under som flyttes opp,
    og ikke ditt element som flyttes ned. */
    const element = itemToMove
    const nextElement = itemToMove.nextElementSibling
    if (nextElement != null) {
      ol.insertBefore(nextElement, element)
    }
  }
  highlight(itemToMove)
  checkIfListIsSaved()
}

function deleteElement(liNo) {
  const itemToDelete = document.getElementById(liNo)
  const ol = document.getElementById('ordered-list')
  ol.removeChild(itemToDelete)
  checkIfListIsSaved()
}

function toggleEditingMode(liNo) {
  const item = document.getElementById(liNo)
  const divImage = item.querySelector('.image')
  const divTextwith = item.querySelector('.text-width')

  if (item.classList.contains('editing-mode')) {
    item.classList.remove('editing-mode')

    const inputTitle = item.querySelector('.title')
    const inputArtist = item.querySelector('.artist')

    const imageSourcePath = item.querySelector('img').src
    const imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)

    const title = inputTitle.value
    const artist = inputArtist.value

    divImage.innerHTML = `
      <img src="images/${imageFilename}" alt="${imageFilename}">
    `

    divTextwith.innerHTML = `
      <span class="title">${title}</span><br>
      <span class="artist">${artist}</span>
    `
    checkIfListIsSaved()
  } else {
    item.classList.add('editing-mode')

    const spanTitle = item.querySelector('.title')
    const spanArtist = item.querySelector('.artist')

    const imageSourcePath = item.querySelector('img').src
    const imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)

    const title = spanTitle.innerHTML
    const artist = spanArtist.innerHTML

    divImage.innerHTML = `
      <form class="image-upload" name="image-upload" method="post" enctype="multipart/form-data">
        <img src="images/${imageFilename}" alt="${imageFilename}"><br>
        <input type="file" class="upload-file" name="upload-file">
        <input type="submit" value="Last opp">
      </form>
    `

    divTextwith.innerHTML = `
      <input class="title" type="text" placeholder="tittel" oninput="checkIfListIsSaved()" value="${title}"><br>
      <input class="artist" type="text" placeholder="artist" oninput="checkIfListIsSaved()" value="${artist}">
    `

    const formImageUpload = item.querySelector('.image-upload')
    formImageUpload.addEventListener('submit', (event) => {
      event.preventDefault()
      const formattedFormData = new FormData(formImageUpload)
      postData(formattedFormData, liNo)
    })
  }
}

/**
 * prevent default behaviour på alle li forms (Endre-funksjonalitet)
 * @param {number} liNo nummer på list item
 */
function formEditLiPreventDefault(liNo) {
  const item = document.getElementById(liNo)
  const form = item.querySelector('.edit-li')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
  })
}

/**
 * Be PHP om å laste ned bilde i mappe, og endre bildet til dette
 * @param {*} formattedFormData 
 * @param {number} liNo nummer på list item
 */
async function postData(formattedFormData, liNo) {
  // PHP laster ned bilde i mappe, eller forteller JS om bilde ikke ble lastet opp
  const response = await fetch('placeImgInFolder.php', {
    method: 'POST',
    body: formattedFormData
  })
  /* Hent echo verdien fra PHP.
  const data vil inneholde en string
  som forteller JS hvilket utfall det ble */
  const data = await response.text()
  // console.log('resultatet ble: ', data)

  // Hvis brukeren ikke lastet opp bilde i <form>:
  if (data == 'lastetIkkeOpp') {
    var imgUploaded = false
  }
  else if (data == 'bleIkkeLastetNed') {
    var imgUploaded = 'feil'
    alert('Bilde ble ikke lastet ned')
  }
  else if (data == 'bleLastetNed') {
    var imgUploaded = true
    // console.log('lastet opp bilde. og det ble lastet ned')
  }

  if (imgUploaded == true) {
    // sett inn bilde
    const imageFilename = document.forms['image-upload']['upload-file'].files[0].name
    const item = document.getElementById(liNo)
    const divImage = item.querySelector('.image')

    divImage.innerHTML = `
      <form class="image-upload" name="image-upload" method="post" enctype="multipart/form-data">
        <img src="images/${imageFilename}" alt="${imageFilename}"><br>
        <input type="file" class="upload-file" name="upload-file">
        <input type="submit" value="Last opp">
      </form>
    `




  }

}

/**
 * Returner tall som ingen har som id.
 * Hent alle listepunkter, gå gjennom dem pluss én omgang til.
 * Vi starter på iterasjon 1, for å sammenligne med id.
 * Ettersom iterasjon starter på 1 på lis.length legges til med to
 * og ikke én.
 */
function findFreeLiId() {
  let lis = document.querySelectorAll('li')
  for (let i = 1; i < lis.length + 2; i++) {
    let element = document.getElementById(i)
    // Dersom ingen elementer har dette tallet som id, er denne id'en ledig
    if (element == null) {
      return i
    }
  }
}

/**
 * Lagre GUI listen i tekstfilen.
 * Konverter GUI listen til en tekststreng,
 * og send denne til PHP som kan ordne opp i resten
 */
function saveList() {
  /* Sørg for at lis ikke er i editing mode
  koden nedenfor er ikke bygd for at denne modusen er åpen */
  makeSureNoLiIsInEditingMode()

  var listAsTextString = ''
  listAsTextString = convertListToTextstring(listAsTextString)

  // Vi har den nye rangeringen som tekstreng, send denne til PHP
  var infoForPhp = { newOrder: listAsTextString } // newOrder: 'tekststreng med gjeldende rangering'
  fetch(`updateFile.php`, {
    method: 'POST',
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: formEncode(infoForPhp)
  })
  setSaveButtonTextTo('&check; Lagret')
}

function makeSureNoLiIsInEditingMode() {
  // Finn ut om noen lis har editing-mode
  const lisWithEditingMode = document.getElementsByClassName('editing-mode')

  if (lisWithEditingMode.length != 0) {
    // Vi har lis med editing mode
    let lisId_WithEditingMode = []

    // Gå gjennom disse og registrer hvilke det gjelder
    for (let i = 0; i < lisWithEditingMode.length; i++) {
      lisId_WithEditingMode.push(lisWithEditingMode[i].id)
    }

    /* Bruke registrerte id'er og kjør editingMode på dem for å slå dem av
    Dette kunne ikke ha blitt gjort i forrige loop, fordi det tuller til HTML-collectionen. */
    lisId_WithEditingMode.forEach(element => {
      toggleEditingMode(element)
    })
  }
}

/**
 * Sjekker om listen har noen ulagrede endringer,
 * for så å legge inn en indikator på dette i saveList-knappen.
 * En lagret endring er når brukeren har endret listen, ikke lagret,
 * og så endret tilbake til startspunktet.
 */
function checkIfListIsSaved() {
  // Sammenlign tekstfil og gjeldende liste
  var listAsTextString = ''
  listAsTextString = convertListToTextstring(listAsTextString)

  fetch('spill.txt')
    .then(res => res.text())
    .then(data => {
      var textFileAsTextString = data
      
      if (textFileAsTextString == listAsTextString) {
        setSaveButtonTextTo('&check; Lagret')
      } else {
        setSaveButtonTextTo('Lagre rangering')
      }
    })
}

/**
 * Definer teksten til save-knappen. Denne kalles gjerne
 * av checkIfListIsSaved() og saveList()
 */
function setSaveButtonTextTo(text) {
  const saveButton = document.getElementById('saveButton')
  saveButton.innerHTML = text
}

function convertListToTextstring(listAsTextString) {
  // Hent gjeldende rangering som string
  let lis = document.querySelectorAll('li')

  /* Finn de rette semantiske ordene i listepunktene, formater dem
  og legg dem til tekststrenger som vi skal sende */
  for (let i = 0; i < lis.length; i++) {
    let imageSourcePath = lis[i].querySelector('img').src
    let imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)
    let title = lis[i].querySelector('.title').innerHTML
    let artist = lis[i].querySelector('.artist').innerHTML
    let liAsTextString = title + ', ' + artist + ', ' + imageFilename
    /* listAsTextString's første linje må ikke starte
    med linjeskift, men de neste linjene må det */
    if (i == 0) {
      listAsTextString += liAsTextString
    } else {
      listAsTextString += '\n' + liAsTextString
    }
  }
  return listAsTextString
}

function refresh() {
  window.location = 'index.html'
}

/**
 * Kode for å pakke inn verdier som skal til PHP, inn i en form, slik at man slipper å måtte
 * ha brukerinput for å sende verdier til PHP.
 * formEncode() og enkelte deler
 * fra saveList() er lagd av
 * Anders_bondehagen på
 * https://forums.fusetools.com/t/how-do-i-receive-post-data-in-php-sent-from-fuse-javascript-by-fetch/5357/3
 */
function formEncode(obj) {
  var str = []
  for (var p in obj) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
  }
  return str.join("&")
}