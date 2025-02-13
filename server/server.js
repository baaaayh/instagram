const express = require("express");
const app = express();

app.get("/", function (req, res) {
    res.send("Welcome!");
});

app.post("/api/login", function (req, res) {
    let success;
    let message;
    // if (req) {
    //     success = true;
    //     message = "로그인 성공.";
    // } else {
    // }
    success = false;
    message = "잘못된 비밀번호입니다. 다시 확인하세요.";
    res.json({
        success,
        message,
    });
});

app.listen(5000, function () {
    console.log("server is running...");
});
