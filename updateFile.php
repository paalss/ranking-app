<?php
// Bare for å se at vi har tilgang
// $file = file_get_contents('spill.txt');
echo $_POST['newOrder']; // dette blir sendt til console.log som data

// Lagre innkommende tekststreng i tekstfila, overskrive det originale
file_put_contents('spill.txt', $_POST['newOrder']);


