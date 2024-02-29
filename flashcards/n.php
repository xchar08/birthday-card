<?php
// Retrieve the file path and the argument from the GET request
$filePath = isset($_GET['fileInput']) ? $_GET['fileInput'] : '';
$argument = isset($_GET['key']) ? $_GET['key'] : '';

// Execute the Python script with the file path and argument as arguments
$output = shell_exec("python script.py \"$fileInput\" \"$key\"");

// Return the output
echo $output;
?>
