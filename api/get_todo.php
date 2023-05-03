<?php


include('./connection.php');

if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}

// Get the query parameter
// $query = $_POST['query'];
$query = "begin todopack.get_all_todos(:result_set); end;";

// Execute the query
$stmt = oci_parse($conn, $query);

// Bind the cursor variable to the result set
$result_set = oci_new_cursor($conn);
oci_bind_by_name($stmt, ":result_set", $result_set, -1, OCI_B_CURSOR);

// Execute the package procedure
oci_execute($stmt);
oci_execute($result_set);

// Fetch the results and convert them to JSON
$results = array();
while ($row = oci_fetch_array($result_set, OCI_ASSOC+OCI_RETURN_NULLS)) {
    $results[] = $row;
}
echo json_encode($results);

// Close the database connection
oci_free_statement($stmt);
oci_free_statement($result_set);
oci_close($conn);
?>