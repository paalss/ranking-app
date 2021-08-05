<?php
require 'db_connection.php';

$deletedItemsId = $_POST['deletedItem'];

$query =
  "DELETE FROM list_elements
  WHERE id=$deletedItemsId";

$data = $db_server->query($query) or die($db_server->error);

echo json_encode($data);

require 'db_closeConnection.php';
