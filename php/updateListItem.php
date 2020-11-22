<?php
require 'db_connection.php';

$place = $_POST['place']; // eg. 1, 2
$listId = $_POST['listId']; // eg. 1

$updatedItem = $_POST['updatedItem']; // eg. 18,fear is the key,alistair maclean,fryktenermittvapen.png

$itemAsArray = explode(',', $updatedItem); // eg. Array(4) [ "18", "fear is the key", "alistair maclean", "fryktenermittvapen.png" ]
// echo json_encode($itemAsArray = explode(',', $updatedItem));

// Insert item into database, or if a record with this id already exists, update it
$query =
"INSERT INTO list_elements (id, in_list, place, title, artist, image_filename)
VALUES ($itemAsArray[0], $listId, $place, '$itemAsArray[1]', '$itemAsArray[2]', '$itemAsArray[3]')
ON DUPLICATE KEY UPDATE in_list=$listId, place=$place, title='$itemAsArray[1]', artist='$itemAsArray[2]', image_filename='$itemAsArray[3]'";

$data = $db_server->query($query) or die($db_server->error);


echo json_encode($data);
// echo $data;
