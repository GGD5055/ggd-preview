<?php
mb_language('Japanese');
mb_internal_encoding('UTF-8');

$TO      = 'info@grow-glow.net';
$SUBJECT = '【GRowGLowDesign】サイトからのお問い合わせ';
$BACK    = 'index.html#contact';
$THANKS  = 'thanks.html';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $BACK);
    exit;
}

if (!empty($_POST['website'])) {
    header('Location: ' . $THANKS);
    exit;
}

$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo '入力内容に不備があります。<a href="' . htmlspecialchars($BACK) . '">戻る</a>';
    exit;
}

foreach ([$name, $email, $service] as $v) {
    if (preg_match('/[\r\n]/', $v)) {
        http_response_code(400);
        echo '不正な入力です。';
        exit;
    }
}

$body  = "【GRowGLowDesignサイトからのお問い合わせ】\n\n";
$body .= "お名前：{$name}\n";
$body .= "メール：{$email}\n";
$body .= "ご相談内容：{$service}\n\n";
$body .= "--- ご要望 ---\n{$message}\n";
$body .= "\n--\n送信日時：" . date('Y-m-d H:i:s') . "\n";
$body .= "IP：" . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";

$headers  = "From: GRowGLowDesign Web <{$TO}>\r\n";
$headers .= "Reply-To: " . mb_encode_mimeheader($name) . " <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$ok = mb_send_mail($TO, $SUBJECT, $body, $headers);

if ($ok) {
    header('Location: ' . $THANKS);
} else {
    http_response_code(500);
    echo '送信に失敗しました。時間をおいて再度お試しいただくか、お電話（052-386-4119）にてご連絡ください。';
}
