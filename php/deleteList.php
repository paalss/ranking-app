<?php
require 'db_connection.php';

$deletedItem = $_POST['deletedItem'];

$itemAsArray = explode(',', $deletedItem);

$query =
"DELETE FROM lists
WHERE id=$itemAsArray[0]";

$data = $db_server->query($query) or die($db_server->error);

echo json_encode($data);
