<?php
require 'db_connection.php';

$updatedItem = $_POST['updatedItem'];

$itemAsArray = explode(',', $updatedItem);

$id = $itemAsArray[0];
$title = $itemAsArray[1];

// Insert item into database, or if a record with this id already exists, update it
$query =
"INSERT INTO lists (id, title)
VALUES ($id, '$title')
ON DUPLICATE KEY UPDATE title='$title'";

$data = $db_server->query($query) or die($db_server->error);

echo json_encode($data);

require 'db_closeConnection.php';