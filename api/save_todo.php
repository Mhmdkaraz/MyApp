<?php


include('./connection.php');


if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}

// Get the form data
$id = $_POST['id'] ? $_POST['id'] : null;
$title = $_POST['title'];
$description = $_POST['description'];

// Prepare the package procedure call
$query = "begin todopack.save_todo(:p_id, :p_title, :p_description); end;";

$stmt = oci_parse($conn, $query);

// Bind the parameters
oci_bind_by_name($stmt, ":p_id", $id);
oci_bind_by_name($stmt, ":p_title", $title);
oci_bind_by_name($stmt, ":p_description", $description);

// Execute the package procedure
try {
    oci_execute($stmt);
    $response = array('success' => true);
    echo json_encode($response);
} catch (Exception $e) {
    $response = array('success' => false, 'error' => $e->getMessage());
    echo json_encode($response);
}

// Close the database connection
oci_free_statement($stmt);
oci_close($conn);

?>