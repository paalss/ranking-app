<?php
require 'db_connection.php';

$listId = $_POST['listId']; // eg. 1

$updatedItem = $_POST['updatedItem']; // eg. 18,fear is the key,alistair maclean,fryktenermittvapen.png
$itemAsArray = explode(',', $updatedItem); // eg. Array(4) [ "18", "fear is the key", "alistair maclean", "fryktenermittvapen.png" ]
// echo json_encode($itemAsArray = explode(',', $updatedItem));
$id = $itemAsArray[0];
$title = $itemAsArray[1];
$artist = $itemAsArray[2];
$imageFilename = $itemAsArray[3];

$isTrashed = $_POST['isTrashed'];
if ($isTrashed == "true") {
  $place = $itemAsArray[4];
} else {
  $place = $_POST['place']; // eg. 1, 2
}

// Insert item into database, or if a record with this id already exists, update it
$query =
  "INSERT INTO list_elements (id, in_list, place, title, artist, image_filename, is_trashed)
  VALUES ($id, $listId, $place, '$title', '$artist', '$imageFilename', $isTrashed)
  ON DUPLICATE KEY UPDATE in_list=$listId, place=$place, title='$title', artist='$artist', image_filename='$imageFilename', is_trashed=$isTrashed";

$data = $db_server->query($query) or die($db_server->error);

// echo json_encode($isTrashed);
// echo json_encode($place);
echo json_encode($data); // Uncaught (in promise) SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data
require 'db_closeConnection.php';




// if ($isTrashed == 'true') {
//   /* if the item is trashed, it means
//   it doesnt have a 'place' */
//   // Insert item into database, or if a record with this id already exists, update it
//   $query =
//     "INSERT INTO list_elements (id, in_list, title, artist, image_filename, is_trashed)
//     VALUES ($itemAsArray[0], $listId, '$itemAsArray[1]', '$itemAsArray[2]', '$itemAsArray[3]', $isTrashed)
//     ON DUPLICATE KEY UPDATE in_list=$listId, title='$itemAsArray[1]', artist='$itemAsArray[2]', image_filename='$itemAsArray[3]', is_trashed=$isTrashed";
// } else {
// }
