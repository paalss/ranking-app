<?php
/* Save list (incoming text string) over savefile
file_put_contents returns false on failure, and amount of bytes added on success */
if(!file_put_contents("lists/$_POST[saveFile]", $_POST['newChange'])) {
  echo 'Fail';
} else {
  echo 'Success';
}