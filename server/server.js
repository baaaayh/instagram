const express = require("express");

const pool = require("./db.js");

const app = express();

app.use(express.json());
app.get("/", function (req, res) {
    res.send("Welcome!");
});

app.post("/api/accounts/signup", function (req, res) {
    console.log(req.body);
});

app.post("/api/accounts/duplicate", function (req, res) {
    const params = req.body.params;
    if (params.name === "id" || params.name === "nickName") {
        let message;
        if (params.name === "id") {
            message = "다른 계정에서 동일한 이메일 주소를 사용 중입니다.";
        }
        if (params.name === "nickName") {
            message = "이 사용자 이름은 이미 다른 사람이 사용하고 있습니다.";
        }

        pool.query("SELECT * FROM users WHERE $1 = $2", [
            params.name,
            params.value,
        ]).then((result) => {
            if (result.rows.length > 0) {
                res.json({
                    success: false,
                    name: params.name,
                    message,
                });
            } else {
                res.json({
                    success: true,
                    name: params.name,
                    message: "중복 없음.",
                });
            }
        });
    }
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
