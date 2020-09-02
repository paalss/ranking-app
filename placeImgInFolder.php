<?php
// Tilgjengelige data fra <form>:
// echo $_POST['artist'];
// echo $_POST['title']; // undefined index
echo $_FILES['uploadFile']['tmp_name']; // undefined index
// echo $_FILES['uploadFile']['name']; // undefined index

// if (is_uploaded_file($_FILES['uploadFile']['tmp_name'])) {
//   $tmp_name = $_FILES["uploadFile"]['tmp_name'];
//   $name = $_FILES['uploadFile']['name'];

//   // Flytt filen inn i images/mappa, og echo feedback
//   if (move_uploaded_file($tmp_name, "images/$name")) {
//     echo 'bleLastetNed';
//   } else {
//     echo 'bleIkkeLastetNed'; // nedlasting av bilde feilet
//   }
// } else {
//   echo 'lastetIkkeOpp'; // brukeren lastet ikke opp noe bilde
// }