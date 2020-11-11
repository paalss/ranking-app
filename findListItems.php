<?php
require 'db_connection.php';
$listId = $_POST['POSTValue'];

$query =
"SELECT * FROM list_elements
WHERE in_list = $listId
ORDER BY place";

$listElements = $db_server->query($query) or die($db_server->error);

echo json_encode(mysqli_fetch_all($listElements));