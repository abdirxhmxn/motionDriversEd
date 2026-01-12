<?php
// -----------------------------------------------------
// Motion Drivers Ed — Form Handler
// -----------------------------------------------------

// Error collection
$errors = [];

// Validate + sanitize input fields
$name   = isset($_POST["name"])   ? trim($_POST["name"])   : "";
$email  = isset($_POST["email"])  ? trim($_POST["email"])  : "";
$phone  = isset($_POST["phone"])  ? trim($_POST["phone"])  : "";
$terms  = isset($_POST["terms"])  ? $_POST["terms"] : "";
$notes  = isset($_POST["notes"])  ? trim($_POST["notes"])  : "";
$service = isset($_POST["service"]) ? trim($_POST["service"]) : "";
$date   = isset($_POST["date"])   ? trim($_POST["date"])   : "";
$time   = isset($_POST["time"])   ? trim($_POST["time"])   : "";

// --- Validation ---
if ($name === "")   $errors[] = "Full name is required.";
if ($email === "")  $errors[] = "Email address is required.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email format.";
if ($phone === "")  $errors[] = "Phone number is required.";
if ($terms === "")  $errors[] = "You must agree to the terms before submitting.";

// If errors, stop execution
if (count($errors) > 0) {
    echo implode("<br>", $errors);
    exit;
}

// --- Email Settings ---
$EmailTo = "laxabdul@gmail.com";
$Subject = "New Booking — Motion Drivers Ed";
$reference = "MDE-" . date("YmdHis") . "-" . rand(1000, 9999);

// --- Email Body ---
$Body = "New booking received from Motion Drivers Ed:\n\n";
$Body .= "Name: $name\n";
$Body .= "Email: $email\n";
$Body .= "Phone: $phone\n";
if ($service) $Body .= "Service: $service\n";
if ($date)    $Body .= "Preferred Date: $date\n";
if ($time)    $Body .= "Preferred Time: $time\n";
if ($notes)   $Body .= "Notes: $notes\n";
$Body .= "Agreed to Terms: $terms\n";
$Body .= "Reference: $reference\n";
$Body .= "\n--- End of Message ---";

// --- Email Headers ---
$headers = "From: Motion Drivers Ed <no-reply@motiondriversed.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// --- Send Email to Admin ---
$successAdmin = mail($EmailTo, $Subject, $Body, $headers);

// --- Send Confirmation to Customer ---
$confirmSubject = "Your Motion Drivers Ed Booking";
$confirmBody  = "Hi $name,\n\n";
$confirmBody .= "Thanks for booking with Motion Drivers Ed. Here are your details:\n";
$confirmBody .= "Reference: $reference\n";
if ($service) $confirmBody .= "Service: $service\n";
if ($date)    $confirmBody .= "Preferred Date: $date\n";
if ($time)    $confirmBody .= "Preferred Time: $time\n";
if ($notes)   $confirmBody .= "Notes: $notes\n";
$confirmBody .= "\nWe'll be in touch soon to confirm your session.\n\n";
$confirmBody .= "— Motion Drivers Ed Team";

$confirmHeaders = "From: Motion Drivers Ed <no-reply@motiondriversed.com>\r\n";
$confirmHeaders .= "Reply-To: Motion Drivers Ed <no-reply@motiondriversed.com>\r\n";
$confirmHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

$successConfirm = mail($email, $confirmSubject, $confirmBody, $confirmHeaders);

// --- Response ---
if ($successAdmin && $successConfirm) {
    echo "success";
} else {
    echo "Something went wrong. Please try again later.";
}
?>
