const express = require("express");
const pool = require("./db.js");
const app = express();
const bcrypt = require("bcryptjs");
const login = require("./auth/auth.js");
const cors = require("cors");

console.log(login);

app.use(
    cors({
        origin: "http://localhost:5174",
        credentials: true,
    })
);
app.use(express.json());

app.get("/", function (req, res) {
    res.send("Welcome!");
});

app.post("/api/accounts/login", login);

app.post("/api/accounts/signup", async function (req, res) {
    const { id, password, username, nickname } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (id, hashed_password, username, nickname) VALUES ($1, $2, $3, $4) RETURNING id, username, nickname",
            [id, hashedPassword, username, nickname]
        );

        res.status(201).json({
            success: true,
            id: newUser.rows[0].id,
            username: newUser.rows[0].username,
            nickname: newUser.rows[0].nickname,
        });
    } catch (error) {
        res.status(500).json({
            message: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
        });
        console.log(error);
    }
});

app.post("/api/accounts/validate", async function (req, res) {
    const { name, value } = req.body.params;
    if (name === "id" || name === "nickname") {
        let message;
        let item;

        if (name === "id") {
            message = "다른 계정에서 동일한 이메일 주소를 사용 중입니다.";
            item = name.toLowerCase();
        }
        if (name === "nickname") {
            message = "이 사용자 이름은 이미 다른 사람이 사용하고 있습니다.";
            item = name.toLowerCase();
        }

        const query = `SELECT * FROM users WHERE ${item} = $1`;

        pool.query(query, [value]).then((result) => {
            if (result.rows.length > 0) {
                res.status(201).json({
                    success: false,
                    name: name,
                    message,
                });
            } else {
                res.status(201).json({
                    success: true,
                    name: name,
                    message: "중복 없음.",
                });
            }
        });
    }
});

app.listen(5000, function () {
    console.log("server is running...");
});
