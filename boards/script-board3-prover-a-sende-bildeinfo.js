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

        createListItem(image, title, artist, liNo)
        formPreventDefault(liNo)
      });
    })
}

function createListItem(image, title, artist, liNo) {
  const orderedList = document.getElementById('ordered-list')
  // Lag hierarkiet av elementer
  let li = document.createElement('li')
  li.id = liNo
  let flexDiv = document.createElement('div')
  li.appendChild(flexDiv)
  flexDiv.classList.add('flex-li')
  orderedList.appendChild(li)

  // Lag innholdet i elementer
  flexDiv.innerHTML = `
    <form class="form-create-li" name="form-create-li" method="post" enctype="multipart/form-data">
      <div class="image">
        <img src="images/${image}" alt="${image}">
      </div>
      <div class="text-width">
        <span id="title" class="title">${title}</span><br>
        <span id="artist" class="artist">${artist}</span>
      </div>
      <button onclick="toggleEditingMode(${liNo})">Endre</button>
    </form>
    <button onclick="moveElement(${liNo}, 'up')"><div class="arrow-up"></div></button>
    <button onclick="moveElement(${liNo}, 'down')"><div class="arrow-down"></div></button>
  `
}

/**
 * prevent default behaviour på alle li forms (Endre-funksjonalitet)
 * og ordne for opplasting av bilde
 * @param {number} liNo nummer på list item
 */
function formPreventDefault(liNo) {
  const item = document.getElementById(liNo)
  var form = item.querySelector('.form-create-li')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    /* execute kun hvis brukeren har editing-mode åpen på denne listen,
    og skal submitte sine endringer */
    if (!item.classList.contains('editing-mode')) {

      // console.log('submitted i editing-mode. Legg til bilde her. kanskje denne block\'en kan puttes i toggleEditingMode');
      /* Send form data (det er bare input="type"s value vi trenger)
      til PHP som kan laste ned bilde i mappe */
      const formattedFormData = new FormData(form)
      console.log('dette er dataen som sendes til php. men den anerkjennes ikke av php. (uploadFile er undefined index sier den)')
      console.log(form.innerHTML)
      postData(formattedFormData)

    } else {
      // Redeklarer form, for å se om det er noen bilder lastet opp
      form = item.querySelector('.form-create-li')
    }
  })
}

async function postData(formattedFormData) {
  // PHP laster ned bilde i mappe, eller forteller JS om bilde ikke ble lastet opp
  const response = await fetch('placeImgInFolder.php', {
    method: 'POST',
    body: formattedFormData
  })
  /* Hent echo verdien fra PHP.
  const data vil inneholde en string
  som forteller JS hvilket utfall det ble */
  const data = await response.text()
  console.log('resultatet ble: ', data)

  // Hvis brukeren ikke lastet opp bilde i <form>:
  if (data == 'lastetIkkeOpp') {
    var imgUploaded = false
    // console.log('lastet ikke opp')
  }
  // Hvis brukeren lastet opp bilde, men nedlasting feilet:
  else if (data == 'bleIkkeLastetNed') {
    var imgUploaded = 'feil'
    alert('Bilde ble ikke lastet ned')
  }
  // Hvis brukeren lastet opp et bilde, med vellykket nedlastning:
  else if (data == 'bleLastetNed') {
    var imgUploaded = true
    // console.log('lastet opp bilde. og det ble lastet ned')
  }

  if (imgUploaded == true || imgUploaded == false) {
    // Finn ledig li id
    var liNo = countLi()

    // append dataen
    let title = document.getElementById('title').value
    let artist = document.getElementById('artist').value
    if (imgUploaded == true) {
      var uploadFile = document.forms['form-create-new']['uploadFile'].files[0].name
    }

    // Lag hierarkiet av elementer
    let li = document.createElement('li')
    li.id = liNo
    let flexDiv = document.createElement('div')
    li.appendChild(flexDiv)
    flexDiv.classList.add('flex-li')
    orderedList.appendChild(li)

    // Lag innholdet i elementer
    if (imgUploaded == true) {
      flexDiv.innerHTML = '<div><img src="images/' + uploadFile + '" alt=""></div>'
    } else {
      flexDiv.innerHTML = '<div><img src="images/default.png" alt=""></div>'
    }
    flexDiv.innerHTML += '<div class="text-width"><span class="title">' + title + '</span>' + '<br>' + '<span class="artist">' + artist + '</span></div>'
    flexDiv.innerHTML += '<button onclick="moveElement(' + liNo + ', `up`)"><div class="arrow-up"></div></button> <button onclick = "moveElement(' + liNo + ', `down`)"><div class="arrow-down"></div></button>'
  }

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

  } else {
    item.classList.add('editing-mode')

    const spanTitle = item.querySelector('.title')
    const spanArtist = item.querySelector('.artist')

    const imageSourcePath = item.querySelector('img').src
    const imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)

    // console.log(imageFilename)
    if (imageFilename==null) {
      // ikke noe bilde er lastet opp
      console.log('ikke nboe builkde lkastet oipp')
      
    }

    const title = spanTitle.innerHTML
    const artist = spanArtist.innerHTML

    divImage.innerHTML = `
      <img src="images/${imageFilename}" alt="${imageFilename}"><br>
      <input type="file" class="upload-file" name="uploadFile">
    `

    divTextwith.innerHTML = `
      <input class="title" type="text" placeholder="tittel" value="${title}"><br>
      <input class="artist" type="text" placeholder="artist" value="${artist}">
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
function countLi() {
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
 * Flytt valgt element i bestemt retning
 * @param {number} liNo 
 * @param {string} direction 
 */
function moveElement(liNo, direction) {
  // Hent elementet som skal flyttes
  var itemToMove = document.getElementById(liNo)
  var ol = document.getElementById('ordered-list')
  // Flytt elementet
  if (direction == 'up') {
    /* Flytt elementet foran i listen under valgt element.
    Dersom foregående element ikke finnes (valgt element ligger øverst i listen), ikke utfør */
    var itemToMoveDown = itemToMove.previousElementSibling
    var replaceThisItem = itemToMove
    if (itemToMoveDown != null) {
      ol.insertBefore(replaceThisItem, itemToMoveDown)
    }
  } else {
    /* Flytt valgt element under den neste i listen.
    Dersom neste element ikke finnes (valgt element ligger nederst i listen), ikke utfør */
    var itemToMoveDown = itemToMove
    var replaceThisItem = itemToMove.nextElementSibling
    // Sjekk om elementet ikke ligger nederst
    if (replaceThisItem != null) {
      ol.insertBefore(replaceThisItem, itemToMoveDown)
    }
  }
  highlight(itemToMove)
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
 * Lagre GUI listen i tekstfilen.
 * Konverter GUI listen til en tekststreng,
 * og send denne til PHP som kan ordne opp i resten
 */
function saveOrder() {
  /* Sørg for at lis ikke er i editing mode
  koden nedenfor er ikke bygd for at denne modusen er åpen*/
  makeSureNoLiIsInEditingMode()

  // Hent gjeldende rangering som string
  let lis = document.querySelectorAll('li')

  /* Finn de rette semantiske ordene i listepunktene, formater dem
  og legg dem til tekststrenger som vi skal sende */
  var olAsTextString = ''

  for (let i = 0; i < lis.length; i++) {
    let imageSourcePath = lis[i].querySelector('img').src
    let imageFilename = imageSourcePath.substring(imageSourcePath.indexOf('images/') + 7)
    let title = lis[i].querySelector('.title').innerHTML
    let artist = lis[i].querySelector('.artist').innerHTML
    let liAsTextString = title + ', ' + artist + ', ' + imageFilename
    /* olAsTextString's første linje må ikke starte
    med linjeskift, men de neste linjene må det */
    if (i == 0) {
      olAsTextString += liAsTextString
    } else {
      olAsTextString += '\n' + liAsTextString
    }
  }

  // Vi har den nye rangeringen som tekstreng, send denne til PHP
  var infoForPhp = { newOrder: olAsTextString } // newOrder: 'tekststreng med gjeldende rangering'
  fetch(`updateFile.php`, {
    method: 'POST',
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: formEncode(infoForPhp)
  })
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

function refresh() {
  window.location = 'index.html'
}

/**
 * Kode for å pakke inn verdier som skal til PHP, inn i en form, slik at man slipper å måtte
 * ha brukerinput for å sende verdier til PHP.
 * formEncode() og enkelte deler
 * fra saveOrder() er lagd av
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