<?php
require 'db_connection.php';

$deletedItem = $_POST['deletedItem']; // eg. 18,fear is the key,alistair maclean,fryktenermittvapen.png

$itemAsArray = explode(',', $deletedItem); // eg. Array(4) [ "18", "fear is the key", "alistair maclean", "fryktenermittvapen.png" ]
// echo json_encode($itemAsArray = explode(',', $deletedItem));

$query =
"DELETE FROM list_elements
WHERE id=$itemAsArray[0]";

$data = $db_server->query($query) or die($db_server->error);


echo json_encode($data);

require 'db_closeConnection.php';
