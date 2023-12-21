<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    return 0;
}

$conn = new PDO("mysql:host=localhost;dbname=social-app", 'root', '');
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        if (isset($_POST['username']) && isset($_POST['major']) && isset($_POST['quote']) && isset($_POST['courses']) && isset($_POST['interests'])) {
            $username = $_POST['username'];
            $major = $_POST['major'];
            $quote = $_POST['quote'];
            $courses = $_POST['courses'];
            $interests = $_POST['interests'];

            // Check if a file is uploaded
            if (isset($_FILES['profilePic']) && $_FILES['profilePic']['error'] === UPLOAD_ERR_OK) {
                // Save the uploaded file to a directory
                $target_dir = "../../../uploads/";
                $target_file = $target_dir . basename($_FILES["profilePic"]["name"]);
                move_uploaded_file($_FILES["profilePic"]["tmp_name"], $target_file);

                // Save the file path to the database
                $sql = "UPDATE users SET major = :major, quote = :quote, courses = :courses, interests = :interests, Profile_Picture = :profilePic WHERE Username = :username";
                $stmt = $conn->prepare($sql);

                $stmt->bindParam(':username', $username);
                $stmt->bindParam(':major', $major);
                $stmt->bindParam(':quote', $quote);
                $stmt->bindParam(':courses', $courses);
                $stmt->bindParam(':interests', $interests);
                $stmt->bindParam(':profilePic', $target_file);

                $stmt->execute();

                echo json_encode(['message' => 'Profile update successful']);
            } else {
                // No file uploaded, update profile information without changing the Profile_Picture column
                $sql = "UPDATE users SET major = :major, quote = :quote, courses = :courses, interests = :interests WHERE Username = :username";
                $stmt = $conn->prepare($sql);

                $stmt->bindParam(':username', $username);
                $stmt->bindParam(':major', $major);
                $stmt->bindParam(':quote', $quote);
                $stmt->bindParam(':courses', $courses);
                $stmt->bindParam(':interests', $interests);

                $stmt->execute();

                echo json_encode(['message' => 'Profile update successful']);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        if (isset($_GET['Username'])) {
            $username = $_GET['Username'];

            $sql = "SELECT * FROM users WHERE Username = :username";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':username', $username);

            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode($user);
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
