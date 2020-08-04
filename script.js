'use strict';
const orderedList = document.getElementById('orderedList')

// Generer GUI liste fra tekstfil
fetch('spill.txt')
  .then(res => res.text())
  .then(data => {
    // Tekstfilen består av flere linjer som hver skal bli en <li>
    let array = data.split('\n')
    var liNo = 0
    array.forEach(spill => {
      liNo++
      // Tekstlinjene består av tankestrek(–) separerte verdier som hver skal behandles ulikt
      let spilldata = spill.split('– ')

      // Lag hierarkiet av elementer
      let li = document.createElement('li')
      li.id = liNo
      let flexDiv = document.createElement('div')
      li.appendChild(flexDiv)
      flexDiv.classList.add('flex')
      orderedList.appendChild(li)

      // Lag innholdet i elementer
      flexDiv.innerHTML = '<div><img src="images/' + spilldata[2] + '" alt=""></div>'
      flexDiv.innerHTML += '<div class="text-width"><span class="title">' + spilldata[0] + '</span>' + '<br>' + '<span class="artist">' + spilldata[1] + '</span></div>'
      flexDiv.innerHTML += '<button onclick="moveElement(' + liNo + ', `up`)"><div class="arrow-up"></div></button> <button onclick = "moveElement(' + liNo + ', `down`)"><div class="arrow-down"></div></button>'
    });
  })

/**
 * Sende form asynkront til PHP. Les mer på denne siden:
 * PHP form submitting with fetch + async/await · GitHub > Submitting a form with JavaScript
 * https://gist.github.com/jesperorb/a6c12f7d4418a167ea4b3454d4f8fb61#submitting-a-form-with-javascript
 */
const form = document.getElementById('form-create-new')
form.addEventListener('submit', (event) => {
  event.preventDefault() // forhindre page reload (default behaviour)
  const formattedFormData = new FormData(form)
  postData(formattedFormData)
})

async function postData(formattedFormData) {
  // PHP laster ned bilde i mappe, eller forteller JS om bilde ikke ble lastet opp
  const response = await fetch('placeImgInFolder.php', {
    method: 'POST',
    body: formattedFormData
  })
  /* Hent echo verdien fra PHP.
  const data vil inneholde det nedlastede bildets navn hvis alt er OK,
  ellers en string som forteller JS hvilket utfall det ble */
  const data = await response.text()

  // Hvis brukeren ikke lastet opp bilde i <form>:
  if (data == 'lastetIkkeOpp') {
    var imgUploaded = false
  }
  // Hvis brukeren lastet opp bilde, men nedlasting feilet:
  else if (data == 'bleIkkeLastetNed') {
    var imgUploaded = 'feil'
    alert('Bilde ble ikke lastet ned')
  }
  // Hvis brukeren lastet opp et bilde, med vellykket nedlastning:
  else if (data == 'bleLastetNed') {
    var imgUploaded = true
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
    flexDiv.classList.add('flex')
    orderedList.appendChild(li)

    // Lag innholdet i elementer
    if (imgUploaded == true) {
      flexDiv.innerHTML = '<div><img src="images/' + uploadFile + '" alt=""></div>'
    } else {
      flexDiv.innerHTML = '<div><img src="images/default.png" alt=""></div>'
    }
    flexDiv.innerHTML += '<div class="text-width"><span class="title">' + title + ' </span>' + '<br>' + '<span class="artist">' + artist + ' </span></div>'
    flexDiv.innerHTML += '<button onclick="moveElement(' + liNo + ', `up`)"><div class="arrow-up"></div></button> <button onclick = "moveElement(' + liNo + ', `down`)"><div class="arrow-down"></div></button>'
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
 * @param {number} itemIdToBeMoved 
 * @param {string} direction 
 */
function moveElement(itemIdToBeMoved, direction) {
  // Hent elementet som skal flyttes
  var itemToBeMoved = document.getElementById(itemIdToBeMoved)
  var ol = document.getElementById('orderedList')
  // Flytt elementet
  if (direction == 'up') {
    /* Flytt elementet foran i listen under valgt element.
    Dersom foregående element ikke finnes (valgt element ligger øverst i listen), ikke utfør */
    var itemToMoveDown = itemToBeMoved.previousElementSibling
    var replaceThisItem = itemToBeMoved
    if (itemToMoveDown != null) {
      ol.insertBefore(replaceThisItem, itemToMoveDown)
    }
  } else {
    /* Flytt valgt element under den neste i listen.
    Dersom neste element ikke finnes (valgt element ligger nederst i listen), ikke utfør */
    var itemToMoveDown = itemToBeMoved
    var replaceThisItem = itemToBeMoved.nextElementSibling
    // Sjekk om elementet ikke ligger nederst
    if (replaceThisItem != null) {
      ol.insertBefore(replaceThisItem, itemToMoveDown)
    }
  }
  highlight(itemToBeMoved)
}

/**
 * Gi en diskré highlight til elementet
 * som ble flyttet
 * @param {element} itemToBeMoved 
 */
function highlight(itemToBeMoved) {
  itemToBeMoved.style.transition = 'background-color 0ms linear'
  itemToBeMoved.style.backgroundColor = 'rgb(34, 34, 34)'
  setTimeout(function () {
    itemToBeMoved.style.transition = 'background-color 500ms linear'
    itemToBeMoved.style.backgroundColor = ''
  }, 500);
}

/**
 * Lagre GUI listen i tekstfilen.
 * Konverter GUI listen til en tekststreng,
 * og send denne til PHP som kan ordne opp i resten
 */
function saveOrder() {
  // Hent gjeldende rangering som string
  let lis = document.querySelectorAll('li')

  /* Finn de rette semantiske ordene i listepunktene, formater dem
  og legg dem til tekststrenger som vi skal sende */
  var olAsTextString = ''

  /* Juster tallene som plusses på / trekkes fra etter hvor mange bokstaver som må utelukkes.
  Vi går jo gjennom en innerHTML her, men vi vil bare ha den rene teksten (men vi henter fra innerHTML for
  å bevare semantikken) */
  for (let i = 0; i < lis.length; i++) {
    let img = lis[i].innerHTML.substring(lis[i].innerHTML.indexOf('images/') + 7, lis[i].innerHTML.indexOf('alt=') - 2)
    let title = lis[i].innerHTML.substring(lis[i].innerHTML.indexOf('title') + 7, lis[i].innerHTML.indexOf(' </span>'))
    let artist = lis[i].innerHTML.substring(lis[i].innerHTML.indexOf('artist') + 8, lis[i].innerHTML.indexOf(' </span>', lis[i].innerHTML.indexOf(' </span>') + 1))
    let liAsTextString = title + ' – ' + artist + ' – ' + img
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