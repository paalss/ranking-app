<?php
$host = 'localhost';
$username = 'root';
$password = '';
$db = 'ranking_app';

// connect to MySQL server
$db_server = new mysqli($host, $username, $password, $db) or die("Could not connect to db!");