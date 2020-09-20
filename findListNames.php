<?php
$lists = glob("./lists/*.txt"); // print full path
foreach ($lists as &$list) {
  $list = basename($list, ".txt"); // retuns filenames without extension
}
echo json_encode($lists);