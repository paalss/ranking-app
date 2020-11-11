<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'ranking_app';

// connect to database
$db_server = new mysqli($host, $user, $pass, $db) or die("Could not connect to db!");