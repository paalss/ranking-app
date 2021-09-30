<?php
// Docker sign-in
$db_server = mysqli_connect("database", "root", "tiger", "ranking_app");

if (!$db_server) {
  echo "Error: Unable to connect to MySQL." . PHP_EOL;
  echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
  echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
  exit;
}

// // XAMPP sign-in
// // If you want to use XAMPP, un-comment the code below and comment-out the Docker one above ^^
// $host = 'localhost';
// $username = 'root';
// $password = '';
// $db = 'ranking_app';

// // connect to MySQL server
// $db_server = new mysqli($host, $username, $password, $db) or die("Could not connect to db!");