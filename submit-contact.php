
<?php
// Enable error reporting (for debugging — disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Security Headers
    header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.google.com/recaptcha/;");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("X-Content-Type-Options: nosniff");
    header("Referrer-Policy: no-referrer-when-downgrade");
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains");

    // Honeypot (bot trap)
    if (!empty($_POST['particulars'])) {
        die("Bot detected.");
    }

    // reCAPTCHA Verification
    $secretKey = "6LcuTAcrAAAAAPz1L_9WADwbrKcMyKV-aOzzpkCA";
    $recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

    $verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaResponse}");
    $captchaSuccess = json_decode($verify);

    if (!$captchaSuccess->success) {
        die("Captcha verification failed.");
    }

    // Sanitize Inputs
    function clean_input($input, $maxLength = 200) {
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        if (strlen($input) > $maxLength) {
            die("Input too long.");
        }
        return $input;
    }

    function validate_email($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            die("Invalid email.");
        }
        return htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    }

    // Get and clean form inputs
    $name = clean_input($_POST['name'] ?? '');
    $company = clean_input($_POST['companyname'] ?? '');
    $email = validate_email($_POST['email'] ?? '');
    $message = clean_input($_POST['message'] ?? '', 1000);

    // Email Setup
    $to = "info.uk@metslab.com";
    $subject = "New Message from Contact Form - $name";
    $headers = "From: noreply@metslab.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Styled HTML Email Body
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px; }
            .container { background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            h2 { color: #333333; }
            p { margin: 10px 0; }
            .label { font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>Contact Form Submission</h2>
            <p><span class='label'>Name:</span> $name</p>
            <p><span class='label'>Company:</span> $company</p>
            <p><span class='label'>Email:</span> $email</p>
            <p><span class='label'>Message:</span><br>" . nl2br($message) . "</p>
        </div>
    </body>
    </html>";

    // Send Mail
    if (!mail($to, $subject, $emailBody, $headers)) {
        die("Failed to send email.");
    }

    // Redirect or Success Response
    echo "<script>window.location.href='thankyou.html';</script>";
}
?>
