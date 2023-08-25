<?php
// Get the todo ID and completed status from the request
$todoid = $_POST['todoid'];
$completed = $_POST['completed'];

// === "false" ? 1 : 0;
if($completed == "1"){
 $completed = 1;
}else{
 $completed = 0;
}
// die(var_dump($completed));


include('./connection.php');

// Prepare the SQL statement
$stmt = oci_parse($conn, 'BEGIN todopack.update_todo_completed(:p_todoid,:p_completed); END;');


// Bind the parameters
oci_bind_by_name($stmt, ':p_completed', $completed);
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