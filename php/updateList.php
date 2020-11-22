<?php
require 'db_connection.php';

$updatedItem = $_POST['updatedItem'];

$itemAsArray = explode(',', $updatedItem);

// Insert item into database, or if a record with this id already exists, update it
$query =
"INSERT INTO lists (id, title)
VALUES ($itemAsArray[0], '$itemAsArray[1]')
ON DUPLICATE KEY UPDATE title='$itemAsArray[1]'";

$data = $db_server->query($query) or die($db_server->error);

echo json_encode($data);
