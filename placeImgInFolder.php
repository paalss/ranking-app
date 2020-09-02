<?php
// Tilgjengelige data fra <form>:
// echo $_POST['artist'];
// echo $_POST['title'];
// echo $_FILES['upload-file']['tmp_name'];
// echo $_FILES['upload-file']['name'];

if (is_uploaded_file($_FILES['upload-file']['tmp_name'])) {
  $tmp_name = $_FILES["upload-file"]['tmp_name'];
  $name = $_FILES['upload-file']['name'];

  // Flytt filen inn i images/mappa, gi den riktig navn og echo resultatet
  if (move_uploaded_file($tmp_name, "images/$name")) {
    echo 'bleLastetNed';
  } else {
    echo 'bleIkkeLastetNed'; // nedlasting av bilde feilet
  }
} else {
  echo 'lastetIkkeOpp'; // brukeren lastet ikke opp noe bilde
}