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
      flexDiv.innerHTML += '<div><span class="tittel">' + spilldata[0] + '</span>' + '<br>' + '<span class="utgiver">' + spilldata[1] + '</span></div>'
      flexDiv.innerHTML += '<button onclick="moveElement(' + liNo + ', `up`)">Flytt element opp</button> <button onclick = "moveElement(' + liNo + ', `down`)"> Flytt element ned</button>'
    });
  })


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
    var replaceThis = itemToBeMoved
    var itemToBeMoved = itemToBeMoved.previousElementSibling
  } else {
    var replaceThis = itemToBeMoved.nextElementSibling
  }
  ol.insertBefore(replaceThis, itemToBeMoved)
}

/**
 * Lagre GUI listen i tekstfilen.
 * Konverter GUI listen til en tekststreng,
 * og send denne til PHP som kan ordne opp i resten
 */
function saveOrder() {
  // Hent gjeldende rangering som string
  var lis = document.querySelectorAll('li')

  /* Finn de rette semantiske ordene i listepunktene, formater dem
  og legg dem til tekststrenger som vi skal sende */
  var olAsTextString = ''
  /* Juster tallene som plusses på / trekkes fra etter hvor mange bokstaver som må utelukkes.
  Vi går jo gjennom en innerHTML her, men vi vil bare ha den rene teksten (men vi henter fra innerHTML for
  å bevare semantikken) */
  for (let i = 0; i < lis.length; i++) {
    let img = lis[i].innerHTML.substring(lis[i].innerHTML.indexOf('images/') + 7, lis[i].innerHTML.indexOf('.png') + 4)
    let title = lis[i].innerHTML.substring(lis[i].innerHTML.indexOf('tittel') + 8, lis[i].innerHTML.indexOf(' </span>'))
    let author = lis[i].innerHTML.substring(lis[i].innerHTML.indexOf('utgiver') + 9, lis[i].innerHTML.indexOf(' </span>', lis[i].innerHTML.indexOf(' </span>') + 1))
    let liAsTextString = title + ' – ' + author + ' – ' + img
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