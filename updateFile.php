<?php
// Save list (incoming text string) over savefile
if(!file_put_contents("lists/$_POST[saveFile]", $_POST['newChange'])) {
  echo 'Fail';
} else {
  echo 'Success';
}