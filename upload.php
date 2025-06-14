<?php
// SETTINGS
$uploadDir = __DIR__ . '/uploads/';
$publicUrlPrefix = '/uploads/'; // Adjust this if using a CDN or subdirectory
$secretToken = 'MySecretKey123'; // Must match your JS fetch header

// CHECK SECRET HEADER
if ($_SERVER['HTTP_X_UPLOAD_TOKEN'] ?? '' !== $secretToken) {
  http_response_code(403);
  echo json_encode(['error' => 'Invalid token']);
  exit;
}

// CHECK FILE
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing file']);
  exit;
}

$file = $_FILES['file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed = ['png', 'jpg', 'jpeg'];
$maxSize = 2 * 1024 * 1024; // 2 MB

if (!in_array($ext, $allowed) || !in_array($file['type'], ['image/png', 'image/jpeg'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid file type']);
  exit;
}

if ($file['size'] > $maxSize) {
  http_response_code(400);
  echo json_encode(['error' => 'File too large']);
  exit;
}

// MAKE UPLOAD FOLDER IF NEEDED
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0755, true);
}

// GENERATE SAFE FILENAME
$basename = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$filename = $basename . '_' . time() . '.' . $ext;
$targetPath = $uploadDir . $filename;

// MOVE FILE
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
  echo json_encode(['success' => true, 'url' => $publicUrlPrefix . $filename]);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Upload failed']);
}
