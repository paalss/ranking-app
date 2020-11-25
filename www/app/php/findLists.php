<?php
require 'db_connection.php';

$query = 'SELECT * FROM lists';
$lists = $db_server->query($query) or die($db_server->error);
echo json_encode(mysqli_fetch_all($lists));

require 'db_closeConnection.php';