<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        $conn = new PDO("mysql:host=localhost;dbname=social-app", 'root', '');
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Log the $_POST variable
        error_log(print_r($_POST, true));

        if(isset($_POST['username']) && isset($_POST['major']) && isset($_POST['quote']) && isset($_POST['courses']) && isset($_POST['interests'])){
            $username = $_POST['username'];
            $major = $_POST['major'];
            $quote = $_POST['quote'];
            $courses = $_POST['courses'];
            $interests = $_POST['interests'];

            $sql = "UPDATE users SET major = :major, quote = :quote, courses = :courses, interests = :interests WHERE username = :username";
            $stmt = $conn->prepare($sql);

            $stmt->bindValue(':username', $username);
            $stmt->bindValue(':major', $major);
            $stmt->bindValue(':quote', $quote);
            $stmt->bindValue(':courses', $courses);
            $stmt->bindValue(':interests', $interests);

            $stmt->execute();

            echo json_encode(['message' => 'Profile updated successfully']);
        } else {
            echo json_encode(['message' => 'Please provide all profile details']);
        }
    } catch(PDOException $e) {
        echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
    }
}
?>