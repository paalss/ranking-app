<?php
// Lagre innkommende tekststreng i tekstfila, overskriv det originale
file_put_contents('spill.txt', $_POST['newOrder']);


