<?php
// Available data from <form>:
// echo $_POST['artist'];
// echo $_POST['title'];
// echo $_FILES['upload-file']['tmp_name'];
// echo $_FILES['upload-file']['name'];

if (is_uploaded_file($_FILES['upload-file']['tmp_name'])) {
  $tmp_name = $_FILES["upload-file"]['tmp_name'];
  $name = $_FILES['upload-file']['name'];

  // attempt to download file and provide feedback
  if (move_uploaded_file($tmp_name, "images/$name")) {
    echo 'was_downloaded';
  } else {
    echo 'was_not_downloaded';
  }
} else {
  echo 'did_not_upload';
}