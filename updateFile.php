<?php
// Save list (incoming text string) over existing file
if(!file_put_contents('lists/music.txt', $_POST['newChange'])) {
  echo 'Could not save list';
}