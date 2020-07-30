'use strict';
const orderedList = document.getElementById('orderedList')

fetch('spill.txt')
  .then(res => res.text())
  .then(data => {
    // console.log(data)
    // let rot13Data = rot13(data)
    let array = data.split('\n')
    // console.log(array)
    array.forEach(spill => {
      // Del opp dataen
      let spilldata = spill.split('– ')
      // console.log(spilldata)
      // print ut
      let li = document.createElement('li')
      let flexDiv = document.createElement('div')
      flexDiv.classList.add('flex')
      flexDiv.innerHTML = '<div><img src="images/' + spilldata[2] + '" alt=""></div>'
      flexDiv.innerHTML += '<div><span class="tittel">' + spilldata[0] + '</span>' + '<br>' + '<span class="utgiver">' + spilldata[1] + '</span></div>'
      li.appendChild(flexDiv)
      orderedList.appendChild(li)
    });
  })



function moveElement() {
  // Flytt elementet
  let element4 = document.querySelector('li:nth-child(4)')
  let element6 = document.querySelector('li:nth-child(6)')
  console.log(element4)
  let ol = element4.parentNode
  console.log(ol)
  ol.insertBefore(element4, element6)

  // Logg resultatet som en string? (helst det)
  // send ny tekststring til php for å lagre det
  saveOrder()
}

/**
 * Vi har en liste i GUI, den vil vi lagre
 * som en tekstreng, og sende til PHP for
 * å skrive den permanent inn i tekstfilen
 */
function saveOrder() {
  // Hent gjeldende rangering som string
  var ol = document.getElementById('orderedList')
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
  console.log(olAsTextString)

  var infoForPhp = { newOrder: olAsTextString } // newOrder: 'tekst streng med gjeldende rangering'
  fetch(`updateFile.php`, {
    method: 'POST',
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: formEncode(infoForPhp)
  })
    .then(res => res.text()) // When a reply has arrived
    .then(data => {
      console.log(data)
    })
  // return olAsTextString
}

/**
 * formEncode() og enkelte deler
 * fra saveOrder() er lagd av
 * Anders_bondehagen på
 * https://forums.fusetools.com/t/how-do-i-receive-post-data-in-php-sent-from-fuse-javascript-by-fetch/5357/3
 * Dette er kode for å sende verdier til PHP, uten en faktisk <form>
 */
function formEncode(obj) {
  var str = []
  for (var p in obj) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
  }
  return str.join("&")
}