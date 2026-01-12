<?php
// Motion Drivers Ed - Contact Form Handler

// Collect and validate input
$errors  = [];
$name    = isset($_POST["name"]) ? trim($_POST["name"]) : "";
$email   = isset($_POST["email"]) ? trim($_POST["email"]) : "";
$message = isset($_POST["message"]) ? trim($_POST["message"]) : "";
$terms   = isset($_POST["terms"]) ? $_POST["terms"] : "";

if ($name === "")    $errors[] = "Name is required.";
if ($email === "")   $errors[] = "Email is required.";
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email address.";
if ($message === "") $errors[] = "Message is required.";
if ($terms === "")   $errors[] = "Terms are required.";

if (count($errors) > 0) {
    echo implode(" ", $errors);
    exit;
}

// Email settings
$EmailTo   = "laxabdul@gmail.com";
$Subject   = "New contact message — Motion Drivers Ed";
$reference = "MDE-C-" . date("YmdHis") . "-" . rand(1000, 9999);

// Admin email body
$Body  = "New contact message received:\n\n";
$Body .= "Name: $name\n";
$Body .= "Email: $email\n";
$Body .= "Message: $message\n";
$Body .= "Terms: $terms\n";
$Body .= "Reference: $reference\n";

// Send email to admin
$adminHeaders  = "From: Motion Drivers Ed <no-reply@motiondriversed.com>\r\n";
$adminHeaders .= "Reply-To: $email\r\n";
$adminHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
$successAdmin = mail($EmailTo, $Subject, $Body, $adminHeaders);

// Send confirmation to sender
$confirmSubject = "Thanks for contacting Motion Drivers Ed";
$confirmBody  = "Hi $name,\n\n";
$confirmBody .= "Thanks for reaching out. We received your message and will respond soon.\n\n";
$confirmBody .= "Reference: $reference\n";
$confirmBody .= "Your message:\n$message\n\n";
$confirmBody .= "— Motion Drivers Ed Team";
$confirmHeaders  = "From: Motion Drivers Ed <no-reply@motiondriversed.com>\r\n";
$confirmHeaders .= "Reply-To: Motion Drivers Ed <no-reply@motiondriversed.com>\r\n";
$confirmHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
$successConfirm = mail($email, $confirmSubject, $confirmBody, $confirmHeaders);

if ($successAdmin && $successConfirm) {
    echo "success";
} else {
    echo "Something went wrong :(";
}
?>
