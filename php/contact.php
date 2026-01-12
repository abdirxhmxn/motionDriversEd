<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

// Return plain text
header('Content-Type: text/plain; charset=UTF-8');

$errors  = [];
$name    = isset($_POST["name"]) ? trim($_POST["name"]) : "";
$email   = isset($_POST["email"]) ? trim($_POST["email"]) : "";
$message = isset($_POST["message"]) ? trim($_POST["message"]) : "";

if ($name === "")    $errors[] = "Name is required.";
if ($email === "")   $errors[] = "Email is required.";
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email address.";
if ($message === "") $errors[] = "Message is required.";

if (count($errors) > 0) {
    http_response_code(422);
    echo implode(" ", $errors);
    exit;
}

// Variables
$EmailTo   = "laxabdul@gmail.com";
$Subject   = "New contact message - Motion Drivers Ed";
$reference = "MDE-C-" . date("YmdHis") . "-" . rand(1000, 9999);

// Sanitize
$safeName  = str_replace(["\r", "\n"], " ", $name);
$safeEmail = str_replace(["\r", "\n"], " ", $email);

// Email body
$adminBody = "New contact message received:\n\n";
$adminBody .= "Name: $safeName\n";
$adminBody .= "Email: $safeEmail\n";
$adminBody .= "Message:\n$message\n\n";
$adminBody .= "Reference: $reference\n";
$adminBody .= "Submitted From: " . ($_SERVER["HTTP_REFERER"] ?? "unknown") . "\n";

// Confirmation body
$confirmBody = "Hi $safeName,\n\n";
$confirmBody .= "Thanks for reaching out. We received your message and will respond soon.\n\n";
$confirmBody .= "Reference: $reference\n";
$confirmBody .= "Your message:\n$message\n\n";
$confirmBody .= "— Motion Drivers Ed Team";

// =========================
// SEND ADMIN EMAIL
// =========================

$mail = new PHPMailer(true);

try {
    // SMTP Settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.motiondriversed.com'; // <-- change this
    $mail->SMTPAuth   = true;
    $mail->Username   = 'no-reply@motiondriversed.com'; // <-- change this
    $mail->Password   = 'YOUR_EMAIL_PASSWORD';          // <-- change this
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
    $mail->Port       = 587;

    // Sender + recipient
    $mail->setFrom('no-reply@motiondriversed.com', 'Motion Drivers Ed');
    $mail->addAddress($EmailTo);      // admin inbox
    $mail->addReplyTo($safeEmail);    // sender's real email

    // Email content
    $mail->isHTML(false);
    $mail->Subject = $Subject;
    $mail->Body    = $adminBody;

    // Send it
    $mail->send();
    $successAdmin = true;
} catch (Exception $e) {
    http_response_code(500);
    echo "Mailer Error (admin): " . $mail->ErrorInfo;
    exit;
}

// =========================
// SEND CONFIRMATION EMAIL
// =========================

$mailConfirm = new PHPMailer(true);

try {
    $mailConfirm->isSMTP();
    $mailConfirm->Host       = 'smtp.motiondriversed.com'; // <-- change this
    $mailConfirm->SMTPAuth   = true;
    $mailConfirm->Username   = 'no-reply@motiondriversed.com'; // <-- change this
    $mailConfirm->Password   = 'YOUR_EMAIL_PASSWORD';           // <-- change this
    $mailConfirm->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mailConfirm->Port       = 587;

    $mailConfirm->setFrom('no-reply@motiondriversed.com', 'Motion Drivers Ed');
    $mailConfirm->addAddress($safeEmail);

    $mailConfirm->isHTML(false);
    $mailConfirm->Subject = "Thanks for contacting Motion Drivers Ed";
    $mailConfirm->Body    = $confirmBody;

    $mailConfirm->send();
} catch (Exception $e) {
    // Not fatal — admin email already sent
}

// All good
echo "success";
exit;
?>
