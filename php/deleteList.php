<?php
require 'db_connection.php';

$deletedItem = $_POST['deletedItem'];

$itemAsArray = explode(',', $deletedItem);

$query =
"DELETE FROM list_elements
WHERE in_list=$itemAsArray[0]";

$db_server->query($query) or die($db_server->error);

$query =
"DELETE FROM lists
WHERE id=$itemAsArray[0]";

$data = $db_server->query($query) or die($db_server->error);

echo json_encode($data);
