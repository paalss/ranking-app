<?php
// Save list (incoming text string) over existing file
file_put_contents('music.txt', $_POST['newChange']);
echo file_get_contents('music.txt');