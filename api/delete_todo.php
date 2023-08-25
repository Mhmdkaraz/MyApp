<?php

include('./connection.php');

// Get the todo ID from the request
$todoid = $_POST['todoid'];
// Prepare the SQL statement
$stmt = oci_parse($conn, 'BEGIN todopack.delete_todo(:p_todoid); END;');

// Bind the parameter
oci_bind_by_name($stmt, ':p_todoid', $todoid);

// Execute the statement
if (oci_execute($stmt)) {
  // Send success response
  echo json_encode(['success' => true]);
} else {
  // Send error response
  echo json_encode(['success' => false, 'message' => oci_error($stmt)]);
}

// Close the statement and connection
oci_free_statement($stmt);
oci_close($conn);
exit();
?>