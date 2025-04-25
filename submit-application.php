<?php
session_start(); // Start session for CSRF protection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Security Headers
    header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.google.com/recaptcha/;");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("X-Content-Type-Options: nosniff");
    header("Referrer-Policy: no-referrer-when-downgrade");
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains");

    // CSRF Protection
    // if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    //     die("CSRF token validation failed.");
    // }

    // Honeypot to Block Bots
    if (!empty($_POST['honeypot'])) {
        die("Bot detected. Submission blocked.");
    }

    // reCAPTCHA Validation
    $secretKey = "6LcuTAcrAAAAAPz1L_9WADwbrKcMyKV-aOzzpkCA";
    $recaptchaResponse = $_POST['g-recaptcha-response'];

    $verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaResponse}");
    $responseData = json_decode($verifyResponse);

    if (!$responseData->success) {
        die("reCAPTCHA verification failed.");
    }

    // Function to Sanitize Inputs
    function clean_input($input, $maxLength = 100) {
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        if (strlen($input) > $maxLength) {
            die("Error: Input exceeds allowed length.");
        }
        return $input;
    }

    function validate_email($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            die("Error: Invalid email format.");
        }
        return htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    }

    // Sanitize Input Data
    $name = clean_input($_POST['name']);
    $phone = clean_input($_POST['phone'], 15);
    $email = validate_email($_POST['email']);
    $place = clean_input($_POST['place']);
    $experience = clean_input($_POST['experience'], 50);
    $dob = clean_input($_POST['dob'], 10);
    $relocation = ($_POST['relocation'] === 'Yes' || $_POST['relocation'] === 'No') ? $_POST['relocation'] : die("Error: Invalid selection.");

    // Process File Upload (Attachment)
    if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
        die("Error: No file uploaded or upload error.");
    }

    $allowedTypes = ['pdf', 'doc', 'docx'];
    $fileName = basename($_FILES['resume']['name']);
    $fileSize = $_FILES['resume']['size'];
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if (!in_array($fileExt, $allowedTypes) || $fileSize > 2 * 1024 * 1024) {
        die("Error: Invalid file type or size exceeds 2MB.");
    }

    $fileTmpPath = $_FILES['resume']['tmp_name'];
    $fileData = file_get_contents($fileTmpPath);
    $fileBase64 = chunk_split(base64_encode($fileData));

    // Email Details
    $recipient = "info.uk@metslab.com";
    $subject = "New Job Application - $name";

    // Email Headers (MIME Format for Attachment)
    $boundary = md5(time());
    $headers = "From: noreply@metslab.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // Email Body
    $email_body = "--$boundary\r\n";
    $email_body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
    $email_body .= "<html><body>";
    $email_body .= "<h2>New Job Application</h2>";
    $email_body .= "<p><strong>Name:</strong> $name</p>";
    $email_body .= "<p><strong>Phone:</strong> $phone</p>";
    $email_body .= "<p><strong>Email:</strong> $email</p>";
    $email_body .= "<p><strong>Date of Birth:</strong> $dob</p>";
    $email_body .= "<p><strong>Experience:</strong> $experience</p>";
    $email_body .= "</body></html>\r\n";

    // Attach Resume
    $email_body .= "--$boundary\r\n";
    $email_body .= "Content-Type: application/octet-stream; name=\"$fileName\"\r\n";
    $email_body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
    $email_body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $email_body .= "$fileBase64\r\n";
    $email_body .= "--$boundary--";

    mail($recipient, $subject, $email_body, $headers);
    echo "<script>window.location.href = 'thankyou.html';</script>";
}
?>
