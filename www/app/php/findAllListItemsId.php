<?php
require 'db_connection.php';

$query =
"SELECT id FROM list_elements
ORDER BY id";

$data = $db_server->query($query) or die($db_server->error);

echo json_encode(mysqli_fetch_all($data));

require 'db_closeConnection.php';